class NetWork {
  constructor({ host }) {
    this.host = host
  }

  parseManifestUrl({url, fileResolution, fileResolutionTag, hostTag}) {
    return url.replace(fileResolutionTag, fileResolution).replace(hostTag, this.host)
  }

  async fetchFile(url) {
    const response = await fetch(url)
    return response.arrayBuffer()
  }

  async getProperResolution(url) {
    const startMs = Date.now()
    const response = await fetch(url)
    await response.arrayBuffer()
    const endMs = Date.now()
    const durationInMs = (endMs - startMs)
    console.log('durationInMs', durationInMs)

    //Ao invés de calcular o throughput vamos calcular pelo tempo
    const resolution = [
      //pior cenario possivel
      { start: 3001, end: 20000, resolution: 144},
      //até 3 segundos
      { start: 901, end: 3000, resolution: 360},
      //menos de 1 segundo
      { start: 0, end: 900, resolution: 720},
    ]

    const item = resolution.find(item =>{
      return item.start <= durationInMs && item.end >= durationInMs
    })

    const LOWEST_RESOLUTION = 144
    //Se for mais de 30 segundos 
    if(!item) return LOWEST_RESOLUTION

    return item.resolution
  }
}