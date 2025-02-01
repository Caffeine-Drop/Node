export const cafeBeanDto = (params) => {
  return{
    cafe_id: Number(params.cafe_id), 
    bean_id: Number(params.bean_id)
  }
}

export const responseToPreffedBean = ({params, body}) => {
  return{
    user_id: Number(params.user_id),
    roasting_id: Number(body.roasting_id),
    aroma: body.aroma,
    acidity: body.acidity,
    body: body.body,
    country: body.country
  }
}

export const preferredBeanDto = (params) => {
  return{
    user_id: Number(params.user_id),
    prefered_id: Number(params.prefered_id)
  }
}