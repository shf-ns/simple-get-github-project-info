const baseUrl = "https://github.com/";
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
/**
 * 提取star数
 *
 * @param data HTML字符串数组
 * @returns star数数组
 */
function getStarList(data) {
    const list = [];
    //star数的索引
    const indexes = data
        .map((item, idx) => item.includes(`.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>`) ? idx : -1)
        .filter((idx) => idx !== -1);
    indexes.forEach((idx) => {
        list.push(data[idx + 2]?.trim());
    });
    list.splice(0, 2);
    return list;
}
async function getGithubInfo(author) {
    try {
        const result = await fetch(baseUrl + author + "?tab=repositories");
        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }
        //-------------------解析HTML-----------------
        const htmlstr = await result.text();
        const data = htmlstr.split("\n");
        const repoList = getRepoList(data);
        const starList = getStarList(data);
    }
    catch (error) {
        console.log(error);
    }
}
getGithubInfo("Roy-Jin");
export {};
//# sourceMappingURL=index.js.map