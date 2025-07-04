import prisma from '../config/prisma.js'

export const listUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findMany({
      omit: {
        password: true,
      },
    })
    console.log(user);

    res.json({
      message: "This is List all user",
      result: user,
    });
  } catch (error) {
    next(error)
  }
};