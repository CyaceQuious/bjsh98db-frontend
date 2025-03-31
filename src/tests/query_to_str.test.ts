import { SearchQuery } from "../utils/types";
import { searchQueryToString } from "../utils/types";


it("Query to String test", () => {
    const query1: SearchQuery = {
        name: undefined, 
        projectname: undefined, 
        meet: undefined, 
        groupname: undefined
    }; 
    const answer1 = ""; 
    expect(searchQueryToString(query1)).toEqual(answer1); 

    const query2: SearchQuery = {
        name: "fgf", 
        projectname: undefined, 
        meet: "abc", 
        groupname: undefined
    }; 
    const answer2 = "name=fgf&meet=abc"; 
    expect(searchQueryToString(query2)).toEqual(answer2)
});