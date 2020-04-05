import config from '../config/config'

export function loadAlbum(setAlbum) {
  const data = {}
  fetch(config.site + "/api/v2/images/?limit=200")
  .then(res => res.json())
  .then(
    (result) => {
      for(let i in result.items){
        data[result.items[i].id] = config.site + result.items[i].meta.download_url
      }
      setAlbum(data) 
    },
    (error) => {
        console.log(error)
    }
  )
}


export function loadBoxes(setBoxes, pushGookles) {
  const data = {}
  let gookle = {}
  let counter = 0

  // initial latest box
  data['Latest'] = {
    id: -1,
    order_by_latest: true,
    xIndex: 0,
    yIndex: 0
  }
  gookle["Latest"] = [{
    id: -1,
    url: null,
    face: config.default_image
  }]
  pushGookles(gookle)

  // load boxes and initial gookle
  fetch(config.site + "/api/v2/pages/?type=home.BoxPage&child_of=" + config.root_box_id + "&fields=image,order_by_latest&limit=200")
  .then(res => res.json())
  .then(
    (result) => {
      for(let i in result.items){
        // console.log(result.items[i])
        data[result.items[i].title] = {
          id: result.items[i].id,
          order_by_latest: result.items[i].order_by_latest,
          xIndex: counter++,
          yIndex: -1
        }
        // initial gookles
        gookle = {}
        gookle[result.items[i].title] = [{
          id: -1,
          url: config.site + result.items[i].image.meta.html_url,
          face: config.site + result.items[i].image.meta.download_url
        }]
        pushGookles(gookle)
      }
      setBoxes(data)
    },
    (error) => {
        console.log(error)
    }
  )
}



export function loadGookles(boxName, pushGookles, boxes, album, offset, times) {
  function loadData(path) {
    const data = []
    let gookle = {}
    fetch(path)
    .then(res => res.json())
    .then(
      (result) => {
        for(let i in result.items){
          data.push({
            id: result.items[i].id,
            url: result.items[i].meta.html_url,
            face: album[result.items[i].image.id]
          })
          gookle[boxName] = data
          pushGookles(gookle)
        }
      },
      (error) => {
        console.log(error)
      }
    )  
  }  
  const boxId = boxes[boxName].id
  let path = ''
  offset = offset===-1 ? 0: offset

  switch (offset) {
    case 0:
      if (boxId === -1) {
        path = config.site + '/api/v2/pages/?type=home.GooklePage&limit=200&fields=image,show_in_latest,show_in_the_top_of_deck,show_in_the_top_of_latest&offset=' + offset + '&order=' + (boxes[boxName].order_by_latest ? '-first_published_at' : 'first_published_at') + '&show_in_the_top_of_latest=true'
      } else {
        path = config.site + "/api/v2/pages/?type=home.GooklePage&limit=200&fields=image,show_in_latest,show_in_the_top_of_deck,show_in_the_top_of_latest&child_of=" + boxId + "&offset=" + offset + '&order=' + (boxes[boxName].order_by_latest ? '-first_published_at' : 'first_published_at') + '&show_in_the_top_of_deck=true'
      }
      loadData(path)
    default:
      if (boxId === -1) {
        path = config.site + '/api/v2/pages/?type=home.GooklePage&limit=200&fields=image,show_in_latest,show_in_the_top_of_deck,show_in_the_top_of_latest&offset=' + offset + '&order=' + (boxes[boxName].order_by_latest ? '-first_published_at' : 'first_published_at') + '&show_in_the_top_of_latest=false'
      } else {
        path = config.site + "/api/v2/pages/?type=home.GooklePage&limit=200&fields=image,show_in_latest,show_in_the_top_of_deck,show_in_the_top_of_latest&child_of=" + boxId + "&offset=" + offset + '&order=' + (boxes[boxName].order_by_latest ? '-first_published_at' : 'first_published_at') + '&show_in_the_top_of_deck=false'
      }
      loadData(path)
      break;
  }
}