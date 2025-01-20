export const cafeBeanDto = (body) => {
    return{
        cafe_id: Number(body.cafe_id), 
        bean_id: Number(body.bean_id)
    }
}