const prisma = require("../lib/prisma");

exports.getDocuments = async (req, res, next) => {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { fullName: true } }
      }
    });

    res.json({ success: true, data: documents });
  } catch (err) {
    next(err);
  }
};
