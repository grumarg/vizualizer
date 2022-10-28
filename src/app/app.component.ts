import { Component } from '@angular/core';
import { getUniqueId } from './utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public height = 700
  public width = 700

  public box: number[] = [-10, -10, 10, 10] // [minX, minY, maxX, maxY]

  public dots: any = []

  get viewBox() {
    const [minX, minY, maxX, maxY] = this.box

    return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`
  }

  generateDot(quarter: number) {
    const id = getUniqueId(1)

    const redDot = { color: 'green', id }
    const blueDot = { color: '#3F0071', id }

    if (quarter === 1) {
      const x = this.randomNumber(1, 9)
      const y = this.randomNumber(1, 9)
      const kooffX = this.randomNumber(-0.01, 0.01, false)
      const kooffY = this.randomNumber(-0.01, 0.01, false)

      return { x, y, kooffX, kooffY, charge: 1, ...redDot }
    }

    if (quarter === 2) {
      const x = this.randomNumber(-9, -1)
      const y = this.randomNumber(1, 9)
      const kooffX = this.randomNumber(-0.01, 0.01, false)
      const kooffY = this.randomNumber(-0.01, 0.01, false)

      return { x, y, kooffX, kooffY, charge: 1, ...redDot }
    }

    if (quarter === 3) {
      const x = this.randomNumber(-9, -1)
      const y = this.randomNumber(-9, -1)
      const kooffX = this.randomNumber(-0.01, 0.01, false)
      const kooffY = this.randomNumber(-0.01, 0.01, false)

      return { x, y, kooffX, kooffY, charge: 0, ...blueDot }
    }

    if (quarter === 4) {
      const x = this.randomNumber(1, 9)
      const y = this.randomNumber(-9, -1)
      const kooffX = this.randomNumber(-0.01, 0.01, false)
      const kooffY = this.randomNumber(-0.01, 0.01, false)

      return { x, y, kooffX, kooffY, charge: 0, ...blueDot }
    }

    return { x: 0, y: 0, ...redDot }
  }

  randomNumber(min: number, max: number, round = true) {
    // Получить случайное число от min до max
    let rand = min - 0.5 + Math.random() * (max - min + 1)

    return round ? Math.round(rand) : rand
  }

  changeDirection(dots: any[]) {
    const rad = 20 * (Math.PI / 180)

    const upd: any[] = dots.map((d: any) => {
      let adaped_x = (d.kooffX - 0) * Math.cos(rad) - (d.kooffY - 0) * Math.sin(rad) + 0
      let adaped_y = (d.kooffX - 0) * Math.sin(rad) + (d.kooffY - 0) * Math.cos(rad) + 0

      d.kooffX = adaped_x
      d.kooffY = adaped_y

      return d
    })

    this.dots = this.dots.map((d: any) => {
      const dot = upd.find((dot) => dot.id === d.id)
      if (dot) {
        d = dot
      }

      return d
    })

  }

  moveDots() {
    // Скорость
    const speed = 85

    const interval = setInterval(() => {
      const [minX, minY, maxX, maxY] = this.box

      // Границы зоны
      const leavedZone = this.dots.filter((d: any) => d.x < minX + 2 || d.x > maxX - 2 || d.y > maxY - 2 || d.y < minY + 2)
      // const leavedZone = this.dots.filter((d: any) => d.x < minX || d.x > maxX || d.y > maxY || d.y < minY)

      if (leavedZone.length > 0) {
        this.changeDirection(leavedZone)
      }

      // Изменение направления электронов
      const r = 3
      const rad = 15 * (Math.PI / 180)
      const close = 5 * (Math.PI / 180)

      this.dots.map((dot: any) => {
        const { x: X, y: Y } = dot

        this.dots.forEach((d: any) => {
          const { x, y } = d
          let s = (Math.pow(y - Y, 2) + Math.pow(x - X, 2))
          if (s)
            if ((Math.pow(y - Y, 2) + Math.pow(x - X, 2)) <= Math.pow(r, 2)) {
              // Сравниваем заряды
              if (d.charge != dot.charge) {
                console.log('сближаем')
                let adaped_x = (dot.kooffX - 0) * Math.cos(close) - (dot.kooffY - 0) * Math.sin(close) + 0
                let adaped_y = (dot.kooffX - 0) * Math.sin(close) + (dot.kooffY - 0) * Math.cos(close) + 0

                dot.kooffX = adaped_x
                dot.kooffY = adaped_y

                this.dots.map((_d: any) => {
                  if (_d.id === d.id) {
                    const adaped_x = (d.kooffX - 0) * Math.cos(close) - (d.kooffY - 0) * Math.sin(close) + 0
                    const adaped_y = (d.kooffX - 0) * Math.sin(close) + (d.kooffY - 0) * Math.cos(close) + 0

                    _d.kooffX = adaped_x
                    _d.kooffY = adaped_y
                  }

                  return _d
                })
              } else {
                // Заряды равны - отталкиваем
                console.log('отталкиваем')
                let adaped_x = (dot.kooffX - 0) * Math.cos(rad) - (dot.kooffY - 0) * Math.sin(rad) + 0
                let adaped_y = (dot.kooffX - 0) * Math.sin(rad) + (dot.kooffY - 0) * Math.cos(rad) + 0

                dot.kooffX = adaped_x
                dot.kooffY = adaped_y

                this.dots.map((_d: any) => {
                  if (_d.id === d.id) {
                    const adaped_x = (d.kooffX - 0) * Math.cos(rad) - (d.kooffY - 0) * Math.sin(rad) + 0
                    const adaped_y = (d.kooffX - 0) * Math.sin(rad) + (d.kooffY - 0) * Math.cos(rad) + 0

                    _d.kooffX = adaped_x
                    _d.kooffY = adaped_y
                  }

                  return _d
                })
              }
            }
        })

        return dot
      })

      // Moving
      const dots = this.dots.map((dot: any) => {
        if (dot.kooffY && dot.kooffX) {
          dot.x += dot.kooffX
          dot.y += dot.kooffY
        }

        return dot
      })

      this.dots = dots
    }, speed)
  }

  constructor() {
    // Создание точек

    // НЕ ЗАБЫТЬ ОТКРЫТЬ КОНСОЛЬ

    // Только синие - проверить отталкивание
    // const quarters = [3, 4, 3, 4]

    // Только два разных - проверить сближение
    // const quarters = [1, 1, 2, 2, 4]

    // Базовый случай
    const quarters = [1, 2, 3, 4]
    const dots = quarters.map(q => this.generateDot(q))

    this.dots = dots

    // Движение точек
    this.moveDots()
  }

}
