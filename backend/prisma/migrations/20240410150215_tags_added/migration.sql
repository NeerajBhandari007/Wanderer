-- CreateTable
CREATE TABLE "TrailTag" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrailTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostToTrailTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TrailTag_tag_key" ON "TrailTag"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToTrailTag_AB_unique" ON "_PostToTrailTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToTrailTag_B_index" ON "_PostToTrailTag"("B");

-- AddForeignKey
ALTER TABLE "_PostToTrailTag" ADD CONSTRAINT "_PostToTrailTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTrailTag" ADD CONSTRAINT "_PostToTrailTag_B_fkey" FOREIGN KEY ("B") REFERENCES "TrailTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
