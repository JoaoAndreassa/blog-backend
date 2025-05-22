import { Router } from "express";
import {
  forgotPasswordController,
  getProfileController,
  loginController,
  registerController,
  resetPasswordController,
  updateProfileController,
} from "../controllers/auth.controller";
import { upload, verifyToken } from "../middlewares/auth.middleware";
import { getUserById } from "../services/user.service";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

// 🔥 Esta rota permite buscar a imagem de avatar
router.get("/users/:id/avatar", async (req, res) => {
  const user = await getUserById(Number(req.params.id));
  if (!user || !user.avatar) {
    return void res.status(404).send("Avatar não encontrado");
  }
  res.setHeader("Content-Type", "image/jpeg");
  res.send(user.avatar);
});

// ✅ Adicione esta rota para resolver o erro 404
router.get("/me", verifyToken, getProfileController);

router.put(
  "/me",
  verifyToken,
  upload.single("avatar"), // ← Middleware de upload
  updateProfileController
);

export default router;
