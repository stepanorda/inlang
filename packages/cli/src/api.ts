import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { definitions } from '@inlang/database'
let tok = process.env['inlang_KEY'] as string;

export function testReadProjs() {
    let sb = newSupabase()
    let r = sb.from("projects").select("*") // works with policy
    r.then(x => console.log(x))
}

export async function test_getJson() {
    let sb = newSupabase()
    let u = await login(sb, tok)
    console.log(u)
    const dbR = await dbReadTrans(sb)
    console.log(dbR)
    // u.then(x => getData(sb, x.id))
    let jsonStr = ""// getData(sb, u.id)
    return jsonStr

}

/** http apis  */
export function newSupabase() {
    let sb = createClient(
        'https://cqriunspsjhvrvcazqri.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjk5MDU0NCwiZXhwIjoxOTQ4NTY2NTQ0fQ.liAxCtDEkgqyslW1xtN5lpcUJMROiUj1Rsar67eoW00')
    return sb
}

// https://supabase.io/docs/reference/javascript/select
async function readData(sb: SupabaseClient, loggedInUserId: string, text: string) {
    let progO = await sb.from<definitions['project']>('project').select('*').eq('id', loggedInUserId).single()
    // sometable.user.id.
    // return usersO.data
}

async function writeData(sb: SupabaseClient, loggedInUserId: string, text: string, json: String) {
    let { data, error } = await sb.from('messages').upsert({ id: 3 })
    // return data
}

// todo : how to auth?
async function login(sb: SupabaseClient, jwt: string) {
    let x = await sb.auth.api.getUser(jwt) // token works
    let user = x.user
    console.log(x.error)
    return user
}

// json file format 
type jsonFormat = { key_id: string, text: string }

function db2json() {
    let e1
}

async function dbReadTrans(sb: SupabaseClient) {
    // project
    let prj = (await sb
        .from<definitions['project']>('project')
        .select('*')).data

    console.log("prjs : ", prj)

    let r = prj?.flatMap(async x => {
        let id = x.id
        let trans = await sb
            .from<definitions['key']>('key')
            .select('*')
            .match({ project_id: id }).then(keys => {
                let translations = sb
                    .from<definitions['translation']>('translation')
                    .select('*')
                    .in('key_id', keys.data?.map((key) => key.id) ?? [])

                return translations
            })

        return trans.data
    })
    return r;
}

type dbGetArgs = {
    projectId: definitions['project']['id'];
};

export async function dbRead(sb: SupabaseClient, args: dbGetArgs) {
    // table key 
    // project
    const project = await sb
        .from<definitions['project']>('project')
        .select('*')
        .match({ id: args.projectId })
        .single();
    // in-efficient to query three times but doesn't matter for now
    const languages = await sb
        .from<definitions['language']>('language')
        .select('*')
        .match({ project_id: args.projectId });

    const keys = await sb
        .from<definitions['key']>('key')
        .select('*')
        .match({ project_id: args.projectId });

    const translations = await sb
        .from<definitions['translation']>('translation')
        .select('*')
        .in('key_id', keys.data?.map((key) => key.id) ?? []);

}

    // old: userid => permissions=>projects=>id of translations
    //new : user -> org -> project -> keys
    // const x: definitions['user'] | null = null
    // x.id
    // let usersO = await sb.from<definitions['user']>('user').select('*').eq('id', loggedInUserId).single()
    // usersO.data.
    // let orgO = await sb.from<definitions['organization']>('organization').select('*').eq('id', loggedInUserId).single()
    // just select all projs,non authed will not be returned


        // userid => permissions=>projects=>id of translations
    // let { data, error } = await sb.from('user').select('user_id, name').eq('user_id', loggedInUserId)

    // sb.from("").upsert("", "")


        // user
/* let { user, session, error } = await sb.auth.signIn({
    email: 'example@email.com',
    password: 'example-password',
}) */
    // user.id
    // sb.auth.api.getUserByCookie("")
    // user.