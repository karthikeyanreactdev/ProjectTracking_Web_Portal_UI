import {getAll} from '../Action/projectAction';

//redux state
const initialstate={
   Projects:[]
}

const reducer =(state=initialstate,action)=>{
    switch(action.type){
        case getAll:
            return{
                ...state,
                Projects:action.payload
            };
            
             default:
            return state
    }
    
}
export default reducer;