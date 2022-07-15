const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { faker } = require('@faker-js/faker')

function randNonZeroInt(maxInt) {
    return (Math.floor(Math.random() * maxInt)) + 1
}

const categories = []
const products = []
const numCategories = randNonZeroInt(5)
let productId = 0
for (let i = 1; i < numCategories + 1; i++) {
    const numProducts = randNonZeroInt(10)
    categories.push({
        id: i,
        name: faker.commerce.department(),
        description: faker.commerce.productDescription()
    })
    for (let j = 1; j < numProducts + 1; j++) {
        productId++
        products.push({
            id: productId,
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(10, 200),
            image: faker.image.imageUrl(200, 200, 'business', true),
            category_id: i
        })
    }
}

const load = async() => {
    try {
        await prisma.$queryRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`
        console.log('Category table truncated with cascade to Product table')

        await prisma.category.createMany({
            data: categories
        })
        console.log('Categories are created')

        await prisma.product.createMany({
            data: products
        })
        console.log('Products are created')
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

load()
