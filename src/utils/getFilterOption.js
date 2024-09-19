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

    return filterOptions
}