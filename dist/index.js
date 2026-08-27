const baseUrl = "https://github.com/";
async function getGithubInfo(author) {
    try {
        const result = await fetch(baseUrl + author + "?tab=repositories");
        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }
        //-------------------解析HTML-----------------
        const htmlstr = await result.text();
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
        console.log(list);
        //----------获取仓库列表-------------
        const repoList = list.map((item) => item[4]?.slice(0, -4) || "");
    }
    catch (error) {
        console.log(error);
    }
}
getGithubInfo("Moyhuai");
export {};
//# sourceMappingURL=index.js.map