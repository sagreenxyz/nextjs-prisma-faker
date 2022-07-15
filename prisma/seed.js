const { PrismaClient } = require('@prisma/client')
const {categories, products} = require('./data.js')
const prisma = new PrismaClient()

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
