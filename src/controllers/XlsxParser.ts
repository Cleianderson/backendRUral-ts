import { read } from 'xlsx'

const typeFoods = [
  'prato principal 1',
  'prato principal 2',
  'na grelha',
  'fast grill',
  'vegetariano',
  'guarnição',
  'salada crua',
  'salada cozida',
  'sopa',
  'sobremesa',
  'suco'
]

const extractFoods = (filePath) => {
  const file = read(filePath, { type: 'buffer' })
  const firstSheet = file.Sheets[file.SheetNames[0]]
  const cells = Object.keys(firstSheet).filter((i) => i.match(/[a-zA-z]\d+/))

  const week = {}
  cells.forEach((cell, index) => {
    if (firstSheet[cell].t !== 's') return

    const valueCell = firstSheet[cell].v
    if (typeFoods.includes(valueCell.toLowerCase().trim())) {
      week[filterItems(valueCell)] = []
      let _index = 1
      while (
        !typeFoods.includes(
          firstSheet[cells[index + _index]].v.toLowerCase().trim()
        )
      ) {
        week[filterItems(valueCell)].push(firstSheet[cells[index + _index]].v)
        if (typeof firstSheet[cells[index + _index + 1]] === 'undefined') break
        _index += 1
      }
    }
  })
  return week
}

const filterItems = (item) => {
  if (item.toLowerCase() === 'sopa') return 'sopa'
  if (item.toLowerCase() === 'na grelha') return 'gre'
  if (item.toLowerCase() === 'fast grill') return 'fag'
  if (item.toLowerCase() === 'salada cozida') return 'sco'
  if (item.match(/\d/)) {
    return String(item.charAt(0) + item.match(/\d/)[0]).toLowerCase()
  }
  return item.substring(0, 3).toLowerCase()
}

const mountDataToApi = (fileLaunch, fileDinner) => {
  const dataLaunch = extractFoods(fileLaunch)
  const dataDinner = extractFoods(fileDinner)

  const keysLaunch = Object.keys(dataLaunch)
  const keysDinner = Object.keys(dataDinner)

  const week = []
  for (let n = 0; n < 5; n++) {
    const almoco = {}
    const jantar = {}

    for (const lData of keysLaunch) {
      almoco[lData] = dataLaunch[lData][n]
    }
    for (const dData of keysDinner) {
      jantar[dData] = dataDinner[dData][n]
    }

    week.push({ almoco, jantar })
  }

  return week
}

export async function parseExcelFilesToWeekData (req, res) {
  let data = null
  try {
    if (req.files[0].originalname.toLowerCase().includes('almo')) {
      data = mountDataToApi(req.files[0].buffer, req.files[1].buffer)
    } else {
      data = mountDataToApi(req.files[1].buffer, req.files[0].buffer)
    }
    return res.status(200).json(data)
  } catch (err) {
    return res.status(400).json({ error: 'Error on parsing files' })
  }
}
