from utils.llm import get_chat_response, get_chat_response_with_prompt_list

PROMPT = """
你是一个智能检索助手，我需要在北大法宝上检索相关的案例。北大法宝支持按照是否包含对应的关键词对所有的裁判文书进行筛选。接下来我将给出相关的检索要求，请你针对检索要求给出一组检索关键词，以便我进行检索。
你需要注意的点包括：
1. 北大法宝将返回全文包含**所有**检索关键词的案例。这意味着，如果一篇裁判文书不包含其中的某个关键词，该文书将不会被检索到，即不同关键词之间为AND关系。
2. 检索关键词应该在1-10个之内。请**只输出所有的检索关键词，每个关键词之间用空格分开**。
3. 如果你认为某两个关键词包含其一即可，你需要使用 (关键词1|关键词2) 的形式表示，表示关键词1与关键词2为OR关系。而不同的组之间仍然为AND关系。
4. 只允许2个关键词选择其一，而不允许3个及以上，(关键词1|关键词2) 这种形式计算为2个关键词。
4. 两个关键词包含其一的关键词应该在其它关键词前输出。
5. 你的关键词不必与检索要求完全一致，可以扩展到案情相似的关键词，以便找到更多可能的类案，后续我将根据检索到的案例条目数量，请求你修改关键词列表，以便让我找到更多和更匹配的类案。

以下为一个例子。
示例检索要求：
1. 当事人伪造公章代表公司签署合同
2. 当事人签署合同在公司办公场所内
3. 法院认定当事人构成表见代理

示例输出：
(伪造|私刻) (办公室|办公场所) 公章 签订合同 公司 表见代理 构成

这意味着检索形式为：
(伪造 OR 私刻) AND (办公室 OR 办公场所) AND 公章 AND 签订合同 AND 公司 AND 表见代理 AND 构成

--- 

以下为我的检索要求：
{query}
"""

def parse_keywords(keywords_str: str) -> list:
    """
    Parse the keywords string into a list of individual keywords.
    
    Args:
        keywords (str): The keywords string to parse.
        
    Returns:
        list: A list of parsed keywords.
    """
    # Split the keywords by spaces and return as a list
    keywords_str = keywords_str.strip()
    keywords_str = keywords_str.split("\n", 1)[0]
    keywords_list = keywords_str.split(" ")
    keywords = []
    tmp = []
    for x in keywords_list:
        x = x.replace('(', "").replace(')', "")
        if '|' in x:
            x = x.split('|')
            keywords.append((x[0], x[1], 'OR'))
        else:
            tmp.append(x)
            if len(tmp) == 2:
                keywords.append((tmp[0], tmp[1], 'AND'))
                tmp = []
    if len(tmp) == 1:
        keywords.append((tmp[0], None, 'AND'))
        tmp = []
    
    if len(keywords) > 5: keywords = keywords[:5]
    ret = []
    for i, (x, y, z) in enumerate(keywords):
        ret.append(
            {
                "id": i,
                "keyword1": x,
                "keyword2": y if y else "",
                "relation": z,
            }
        )
    return ret


def auto_search(query: str):
    prompt = PROMPT.format(query=query)
    response = get_chat_response(prompt)
    keywords = parse_keywords(response)
    return keywords