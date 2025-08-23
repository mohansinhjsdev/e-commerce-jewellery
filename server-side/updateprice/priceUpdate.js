import cron from "node-cron"
import { fetchAndUpdateGoldRate } from "../controllers/goldController.js"

export const startGoldRateUpdate = ()=>{
    cron.schedule("*/10 * * * *",fetchAndUpdateGoldRate)
}