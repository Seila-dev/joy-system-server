import { app } from './app'
import joyRoutes from './routes/joy-routes'
import notesRoutes from './routes/notes-routes'
import productsRoutes from './routes/products-routes'
import questsRoutes from './routes/quests-routes'
import usersRoutes from './routes/users-routes'

const port = 3000

app.listen(port, () => {
    console.log(`HTTP Server Running! Server: http://localhost:${port}`)
})

// app uses
app.use("/users", usersRoutes)
app.use("/quests", questsRoutes)
app.use("/store", productsRoutes)
app.use("/", joyRoutes)
app.use("notes", notesRoutes)