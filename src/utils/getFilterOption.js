import { TZDate } from "@date-fns/tz"
import { endOfDay, startOfDay } from "date-fns"
import mongoose from "mongoose"

export const getIngredientFilterOptions = (queryParams) => {
    const filterOptions = {}

    if (queryParams.hasOwnProperty("name")) {
        filterOptions.name = { '$regex': queryParams.name, '$options': 'i' }
    }
    if (queryParams.hasOwnProperty("category")) {
        filterOptions.category = queryParams.category
    }
    if (queryParams.hasOwnProperty("unit")) {
        filterOptions.unit = queryParams.unit
    }
    if (queryParams.hasOwnProperty("status")) {
        filterOptions.status = !!queryParams.status
    }

    return filterOptions
}

export const getProductFilterOptions = (queryParams) => {
    const filterOptions = {}
    if (queryParams.hasOwnProperty("category")) {
        filterOptions["category.code"] = queryParams.category
    }
    if (queryParams.hasOwnProperty("name")) {
        filterOptions.name = { '$regex': queryParams.name, '$options': 'i' }
    }
    if (queryParams.hasOwnProperty("status")) {
        filterOptions.status = !!queryParams.status
    }
    if (queryParams.hasOwnProperty("ingredient")) {
        filterOptions["ingredients.data.ingredient.code"] = {
            $in: queryParams.ingredient
        }
    }
    if (queryParams.hasOwnProperty("priceStart") && queryParams.hasOwnProperty("priceEnd")) {
        filterOptions["$and"] = [
            {
                "priceBySize.price": {
                    "$gte": +queryParams.priceStart
                }
            },
            {
                "priceBySize.price": {
                    "$lte": +queryParams.priceEnd
                }
            }
        ]
    }
    return filterOptions
}

export const getIngredientDiaryFilterOptions = (queryParams) => {
    const filterOptions = {}

    if (queryParams.hasOwnProperty('user')) {
        filterOptions.user = { '$regex': queryParams.user, '$options': 'i' }
    }

    if (queryParams.hasOwnProperty('createdAt')) {
        const [d, m, y] = queryParams.createdAt.split("/")
        const date = new TZDate(+y, +m - 1, +d)
        const startOfDate = startOfDay(date)
        const endOfDate = endOfDay(date)

        filterOptions.createdAt = {
            $gte: startOfDate,
            $lt: endOfDate
        }
    }

    return filterOptions
}