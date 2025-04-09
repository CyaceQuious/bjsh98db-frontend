import { SearchQuery } from "../utils/types";
import { interfaceToString } from "../utils/types";


it("Query to String test", () => {
    const query1: SearchQuery = {
        name: undefined, 
        projectname: undefined, 
        meet: undefined, 
        groupname: undefined, 
        page: 1, 
        page_size: 10
    }; 
    const answer1 = "page=1&page_size=10"; 
    expect(interfaceToString(query1)).toEqual(answer1); 

    const query2: SearchQuery = {
        name: "fgf", 
        projectname: undefined, 
        meet: "abc", 
        groupname: undefined, 
        page: 2, 
        page_size: 20
    }; 
    const answer2 = "name=fgf&meet=abc&page=2&page_size=20"; 
    expect(interfaceToString(query2)).toEqual(answer2)
});