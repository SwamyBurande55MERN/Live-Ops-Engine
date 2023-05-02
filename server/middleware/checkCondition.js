// checking all given conditions ==> 


const checkCondition = (user, offer)=>{
    let age = user.age;
    let installedDays = Date.now() - Date.parse(user.createdAt)
    const today = new Date()
    if(!(offer?.schedule?.days?.includes(today.getDay() + 1)) && !(offer?.schedule?.dates?.includes(today.getDate()))){
        return false;
    }
    if(!(offer?.schedule?.months?.includes(today.getMonth() + 1))){
        return false;
    }

    let str = offer.target;
    if(str === 'all')return true;
    str = str.replace('and', '&&');
    str = str.replace('or', '||')
    let res = eval(str);
    return res;
}
module.exports = checkCondition;