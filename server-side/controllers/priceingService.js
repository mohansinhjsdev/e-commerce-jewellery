export function computeJewelryPrice(goldRate,weight,karat,makingCharge){
    return Math.round(goldRate * weight * (karat/24 ) + makingCharge)
}