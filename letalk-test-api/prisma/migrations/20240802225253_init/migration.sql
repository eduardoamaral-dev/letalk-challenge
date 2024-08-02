-- CreateTable
CREATE TABLE "Loan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" REAL NOT NULL,
    "monthlyInterest" REAL NOT NULL,
    "monthlyValue" REAL NOT NULL,
    "monthCount" INTEGER NOT NULL,
    "totalInterest" REAL NOT NULL
);
