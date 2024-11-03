import multer from 'multer'

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'public/images')
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e3)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

export const upload = multer({ storage })
