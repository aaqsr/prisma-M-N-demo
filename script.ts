// to run this script, use the command
// npx ts-node script.ts

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    await removeCatFromUser(2, 3)
    await addCatToUser(2, 1)
    console.log("\n--- Printing Users ---");
    console.log(JSON.stringify(await db.user.findMany({select: {name: true, cats: true}}), null, 2));
    console.log("\n--- Printing Cats ---");
    console.log(JSON.stringify(await db.cat.findMany({select: {type: true, users: true}}), null, 2));
}

async function addCatToUser(userId: number, catId: number) {
    console.log("Adding cat to user")
    JSON.stringify(await db.user.update({
            where: {
                id: userId
            },
            data: {
                cats: {
                    connect: {
                        id: catId
                    }
                }
            }
        }), null, 2)
}

async function removeCatFromUser(userId: number, catId: number) {
    console.log("Removing cat from user")
    JSON.stringify(await db.user.update({
            where: {
                id: userId
            },
            data: {
                cats: {disconnect:{id: catId}}
            }
        }), null, 2)
}

main()
    .then(async () => {
        await db.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await db.$disconnect()
    })

