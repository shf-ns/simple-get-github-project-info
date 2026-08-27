let repoList = [];
let langList = [];
let stratList = [];
let updateTimeList = [];
/**
 * 处理HTML字符串，提取包含所需信息的HTML部分
 * @param {string} htmlstr HTML字符串
 * @returns {string[][]}包含所有所需信息的HTML部分数组
 */
function handleHtml(htmlstr) {
    //----------截取包含所需信息的HTML部分-------------
    const results = [];
    let startIndex = 0;
    while (startIndex < htmlstr.length) {
        //找头部
        const headStart = htmlstr.indexOf('<div class="col-10 col-lg-9 d-inline-block">', startIndex);
        if (headStart === -1)
            break;
        //找尾部（从头部结束位置之后开始找，防止重叠）
        const tailStrat = headStart + '<div class="col-10 col-lg-9 d-inline-block">'.length;
        const tailEnd = htmlstr.indexOf("</relative-time>", tailStrat);
        if (tailEnd === -1)
            break;
        //截取
        results.push(htmlstr.substring(headStart, tailEnd));
        //移动指针，继续找下一处
        startIndex = tailEnd + "</relative-time>".length;
    }
    const list = results.map((item) => item
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== "" &&
        item !== "</h3>" &&
        item !== "</div>" &&
        item !== "</span>" &&
        item !== "</relative-time>" &&
        item !== "</a>" &&
        item !== "</svg>" &&
        item !== "</p>"));
    return list;
}
/**
 * 获取仓库列表
 * @param {string[][]} list 处理后的HTML部分数组
 * @returns {string[]} 仓库列表
 */
function getRepoList(list) {
    list.map((item) => repoList.push(item[4]?.slice(0, -4) || ""));
}
/**
 * 获取语言列表
 * @param {string[][]} list 处理后的HTML部分数组
 * @returns {string[][]} 语言列表
 */
function getLangList(list) {
    list.map((item) => langList.push(item
        .map((items) => {
        if (items.includes('itemprop="programmingLanguage"')) {
            return items;
        }
        return "";
    })
        .filter((item) => item !== "")
        .map((i) => i.slice(37, -7))));
}
/**
 * 获取strat数列表
 * @param {string[][]} list 处理后的HTML部分数组
 * @returns {number[]} strat数列表
 */
function getStratList(list) {
    const index = list
        .map((item) => item.findIndex((items) => items.includes('<svg aria-label="star"')))
        .map((item) => {
        if (item == -1) {
            return item;
        }
        return item + 2;
    });
    for (let i = 0; i < index.length; i++) {
        if (index[i] == -1) {
            stratList.push(0);
            continue;
        }
        stratList.push(parseInt(list[i][index[i]]));
    }
}
function getUpdateTimeList(list) {
    updateTimeList.push(...list
        .map((item) => item[item.length - 1] || "")
        .map((item) => item.slice(item.lastIndexOf(">") + 1)));
}
async function getGithubInfo(author) {
    try {
        const result = await fetch("https://github.com/" + author + "?page=1&tab=repositories");
        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }
        //-------------------------解析HTML----------------------------
        const htmlstr = await result.text();
        //---------------------处理HTML字符串---------------------------
        const list = handleHtml(htmlstr);
        console.log(list);
        //---------------------------获取仓库列表--------------------------------
        getRepoList(list);
        // console.log(repoList);
        console.log(repoList.length);
        //-----------------------------获取语言列表-----------------------------
        getLangList(list);
        // console.log(langList);
        //---------------------------获取strat数--------------------------
        getStratList(list);
        // console.log(stratList);
        //---------------------------获取更新时间--------------------------
        getUpdateTimeList(list);
        // console.log(updateTimeList);
    }
    catch (error) {
        console.log(error);
    }
}
// getGithubInfo("Moyhuai");
getGithubInfo("Roy-Jin");
export {};
// getGithubInfo("xcatliu");
// getGithubInfo("shf-ns");
//# sourceMappingURL=index.js.map