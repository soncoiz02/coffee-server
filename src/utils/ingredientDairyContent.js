export const getIngredientDiaryContent = (type, data) => {
    const { ingredient, updateData } = data
    switch (type) {
        case "create":
            if (Array.isArray(ingredient)) {
                return `Tạo thêm nguyên liệu: ${ingredient.map(data => data.name).join(", ")}`
            }
            return `Tạo thêm nguyên liệu: ${name}`
        case "add-quantity":
            return `${ingredient.name}: Thêm ${updateData.quantity} (${unit})`
        case "remove-quantity":
            return `${ingredient.name}: Bớt ${updateData.quantity} (${unit})`
        default:
            return ''
    }
}