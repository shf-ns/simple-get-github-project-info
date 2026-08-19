const baseUrl = "https://github.com/";
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000);
/**
 * 提取仓库名称
 *
 * @param data HTML字符串数组
 * @returns 仓库名称数组
 */
function getRepoList(data) {
    // ---------------提取仓库名称-----------------
    const list = [];
    data.forEach((item) => {
        if (item.includes('itemprop="name codeRepository"')) {
            list.push(item);
        }
    });
    const arr = list.map((item) => item.trim().split(" ")[1]);
    const repoList = arr.map((item) => {
        if (item) {
            return item.slice(item.lastIndexOf("/") + 1);
        }
    });
    return repoList;
}
async function getGithubInfo(author) {
    try {
        const result = await fetch(baseUrl + author + "?tab=repositories", {
            signal: controller.signal,
        });
        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }
        //-------------------解析HTML-----------------
        const htmlstr = await result.text();
        const data = htmlstr.split("\n");
        const repoList = getRepoList(data);
        return repoList;
    }
    catch (error) {
        console.log(error);
    }
    finally {
        clearTimeout(timeoutId);
    }
}
getGithubInfo("Moyhuai");
export {};
//# sourceMappingURL=index.js.map