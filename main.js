import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import Feature from 'ol/Feature'
import { Polygon, LineString, MultiPolygon, MultiLineString, GeometryCollection } from 'ol/geom'
import { Fill, Stroke, Style } from 'ol/style'
import { smooth } from './chaikin'

const K = v => f => { f(v); return v }

const COORDINATES = {
  ring_outer: [
    [763094.739894987, 7032070.448829096],
    [762478.4663544378, 7000110.216377356],
    [792709.311041225, 7000110.216377356],
    [792967.2860116875, 7029550.415552819],
    [763094.739894987, 7032070.448829096]
  ],
  ring_inner: [
    [765575.4528235778, 7010997.160796477],
    [771874.8925835713, 7002214.766502332],
    [787067.1907472459, 7004322.541132927],
    [781723.1162589102, 7027764.31890015],
    [775396.8068506514, 7027022.418056378],
    [765575.4528235778, 7010997.160796477]
  ],
  line_a: [
    [775399.9152315934, 6980615.281651384],
    [774984.2204655495, 6974612.6298725605],
    [772561.6733190814, 6969866.740966165],
    [767341.0503434326, 6966215.4988127295],
    [763590.602803455, 6960842.438291907],
    [762968.7544048909, 6955234.1884156745],
    [779723.3343699367, 6955179.504470899]
  ],
  line_b: [
    [771269.5836504698, 6962621.844176359],
    [777088.3425176557, 6972127.171993163],
    [787248.4258856337, 6977067.600242923],
    [787251.8133866375, 6962100.169021766]
  ]
}

const GEOMETRY = {}
const translate = (dx, dy) => g => K(g)(g => g.translate(dx, dy))
GEOMETRY.polygon_a = new Polygon([COORDINATES.ring_outer])
GEOMETRY.polygon_b = translate(+100000, 0)(new Polygon([COORDINATES.ring_outer, COORDINATES.ring_inner]))
GEOMETRY.polygon_c = translate(+200000, 0)(new MultiPolygon([[COORDINATES.ring_outer], [COORDINATES.ring_inner]]))
GEOMETRY.linestring_a = new LineString(COORDINATES.line_a)
GEOMETRY.linestring_b = translate(+100000, 0)(new MultiLineString([COORDINATES.line_a, COORDINATES.line_b]))
GEOMETRY.collection = translate(+300000, 0)(new GeometryCollection([
  new LineString(COORDINATES.line_a),
  new Polygon([COORDINATES.ring_outer])
]))

const features = Object.values(GEOMETRY)
  .map(geometry => new Feature({ geometry: smooth(4)(geometry) }))

const style = () => {
  const fill = new Fill({ color: 'rgba(255,255,155,0.4)' })
  const stroke = new Stroke({ color: '#3399CC', width: 3 })
  return new Style({ fill: fill, stroke: stroke })
}

new Map({
  target: 'map',
  layers: [
    new VectorLayer({
      source: new VectorSource({ features }),
      style: style()
    })
  ],
  view: new View({
    center: [908373.595, 6971994.591],
    zoom: 9
  })
})
