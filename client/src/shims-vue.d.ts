declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}
interface Window {
    diff_match_patch: any;
    DIFF_DELETE: number;
    DIFF_INSERT: number;
    DIFF_EQUAL: number;
}