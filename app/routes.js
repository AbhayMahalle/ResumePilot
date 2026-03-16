import { index, route } from "@react-router/dev/routes";

export default [
index("routes/landing.jsx"),
route("/auth", "routes/auth.jsx"),
route("/dashboard", "routes/home.jsx"),
route("/upload", "routes/upload.jsx"),
route("/resume/:id", "routes/resume.jsx"),
route("/profile", "routes/profile.jsx"),
route("/wipe", "routes/wipe.jsx")];