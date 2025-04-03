


export const FiltersMapper = (filters) => {
    return JSON.parse(JSON.stringify(filters).replace(/lt|gt|gte|lte|regex/g, (match) => `$${match}`))

}