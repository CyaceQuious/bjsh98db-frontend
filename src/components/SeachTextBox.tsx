// 组件：基本文本搜索框

interface SearchTextBoxProps {
    name: string; // 搜索框名称
    query: string; // 搜索框中内容
    textChange: (name: string, value: string) => void;
}

export default function SearchTextBox({ name, query, textChange}: SearchTextBoxProps) {
    return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: "3px"}}>
            <div style={{width: "20%"}}>
                <p>{name}: </p>
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => textChange(name, e.target.value)}
                placeholder="请输入搜索内容，留空代表不指定"
                style={{width: "80%"}}
            />
        </div>
    );
}