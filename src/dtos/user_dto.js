export const preferredBeanDto = ({params, body}) => {
  return{
    user_id: Number(params.user_id),
    roasting_id: Number(body.roasting_id),
    aroma: body.aroma,
    acidity: body.acidity,
    body: body.body,
    country: body.country
  }
}