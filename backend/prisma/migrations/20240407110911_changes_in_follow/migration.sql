/*
  Warnings:

  - You are about to drop the `UserFollowers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFollowing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserFollowers" DROP CONSTRAINT "UserFollowers_followerId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollowers" DROP CONSTRAINT "UserFollowers_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollowing" DROP CONSTRAINT "UserFollowing_followingId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollowing" DROP CONSTRAINT "UserFollowing_userId_fkey";

-- DropTable
DROP TABLE "UserFollowers";

-- DropTable
DROP TABLE "UserFollowing";

-- CreateTable
CREATE TABLE "UserFollow" (
    "id" SERIAL NOT NULL,
    "followerId" INTEGER NOT NULL,
    "followedId" INTEGER NOT NULL,

    CONSTRAINT "UserFollow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserFollow_followerId_followedId_key" ON "UserFollow"("followerId", "followedId");

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
