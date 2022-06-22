"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkArray = void 0;
const Client_1 = require("./Client");
const api = new Client_1.Keto.Client({
    writeUrl: "http://localhost:30001",
    readUrl: "http://localhost:30002"
});
const test = async () => {
    try {
        const ready = await api.MetadataApi.GetServerAndDatabaseStatus();
        const version = await api.MetadataApi.GetVersion();
        const tuple1 = {
            namespace: "test",
            object: "test",
            relation: "test",
            subject_id: "test",
        };
        const created = await api.WriteApi.Create(tuple1);
        const get = await api.ReadApi.Query({
            namespace: "test",
            page_size: 2
        });
        const checkGet = await api.ReadApi.CheckGet(tuple1);
        const checkPost = await api.ReadApi.CheckPost(tuple1);
        const tuple2 = {
            namespace: "groups",
            object: "test",
            relation: "member",
            subject_id: "admin",
        };
        const tuple3 = {
            namespace: "groups",
            object: "test",
            relation: "member",
            subject_id: "editor",
        };
        await api.WriteApi.Create(tuple2);
        await api.WriteApi.Create(tuple3);
        const tuple4 = {
            namespace: "test",
            object: "test",
            relation: "inherit",
            subject_set: {
                namespace: "groups",
                object: "test",
                relation: "member",
            }
        };
        await api.WriteApi.Create(tuple4);
        const admin = await api.ReadApi.CheckPost({
            namespace: "test",
            object: "test",
            relation: "inherit",
            subject_id: "admin"
        });
        const expand = await api.ReadApi.Expand({
            namespace: "test",
            object: "test",
            relation: "inherit",
        });
        const todelete = {
            namespace: "test",
            object: "delete_me",
            relation: "test",
            subject_id: "test",
        };
        await api.WriteApi.Create(todelete);
        const d = await api.WriteApi.Delete(todelete);
        const multiple = await api.WriteApi.PatchMultiple([
            {
                action: "delete",
                relation_tuple: tuple1
            },
            {
                action: "delete",
                relation_tuple: tuple2
            },
            {
                action: "delete",
                relation_tuple: tuple3
            },
            {
                action: "delete",
                relation_tuple: tuple4
            }
        ]);
    }
    catch (error) {
        console.log(error);
    }
};
const scale = async () => {
    const mult = 5;
    const objs = 6;
    const objects = new Array(objs * mult).fill(0).map((_, i) => `book-${i}`);
    const subjects = new Array(100 * mult).fill(0).map((_, i) => `subject-${i}`);
    const groups = new Array(objs * mult).fill(0).map((_, i) => `group-${i}`);
    const members = groups.map(group => sample(subjects, 20 * mult).map(subject => {
        return {
            namespace: "groups",
            object: group,
            relation: "member",
            subject_id: subject
        };
    })).reduce((a, b) => a.concat(b), []);
    const inherited = groups.map((group, i) => {
        return {
            namespace: "test",
            object: `book${i}`,
            relation: "read",
            subject_set: {
                namespace: "groups",
                object: group,
                relation: "member",
            }
        };
    });
    const direct = objects.map(object => sample(subjects, 5 * mult).map(subject => {
        return [
            {
                namespace: "test",
                object,
                relation: "read",
                subject_id: subject
            },
            {
                namespace: "test",
                object,
                relation: "write",
                subject_id: subject
            },
        ];
    })).reduce((a, b) => a.concat(b), []).reduce((a, b) => a.concat(b), []);
    console.log("Data ready.");
    const a = [members, inherited, direct];
    let promises;
    promises = a.map((tuples) => {
        return api.WriteApi.PatchMultiple(tuples.map(i => {
            return {
                action: "insert",
                relation_tuple: i
            };
        }));
    });
    await Promise.all(promises);
    console.log("Data inserted.");
    promises = (objects.map((object) => api.ReadApi.Expand({
        namespace: "test",
        object,
        relation: "read",
    })));
    let r = await Promise.all(promises);
    console.log("Data expanded.");
    // console.dir(r, { depth: null })
    let checks = subjects.map(subject => {
        return objects.map(object => {
            return Array(10).fill({
                namespace: "test",
                object,
                relation: "read",
                subject_id: subject
            });
        });
    }).reduce((a, b) => a.concat(b), []).reduce((a, b) => a.concat(b), []);
    checks = shuffle(checks);
    console.log("len: ", checks.length);
    const batches = chunkArray(checks, 5000);
    console.log("batches: ", batches.length);
    let i = 0;
    for (let batch of batches) {
        console.log(`Started batch ${i}`);
        await Promise.all(batch.map((d) => api.ReadApi.CheckGet(d)));
        console.log(`Comleted batch ${i++}`);
    }
    console.log("Data checked.");
    promises = a.map((tuples) => {
        api.WriteApi.PatchMultiple(tuples.map(i => {
            return {
                action: "delete",
                relation_tuple: i
            };
        }));
    });
    await Promise.all(promises);
    console.log("Data deleted.");
};
const run = async () => {
    const start = new Date().getTime();
    await scale();
    // await test()
    console.log(`${new Date().getTime() - start}ms`);
};
run();
function sample(arr, n) {
    let res = [];
    for (let i = 0; i < n; i++) {
        const index = Math.floor(Math.random() * arr.length);
        const item = arr[index];
        res.push(item);
    }
    return res;
}
function shuffle(array) {
    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}
function chunkArray(array, size) {
    const result = [];
    let start = 0;
    for (let i = 0; i < array.length / size; i++, start += size)
        result.push(array.slice(start, start + size));
    return result;
}
exports.chunkArray = chunkArray;
