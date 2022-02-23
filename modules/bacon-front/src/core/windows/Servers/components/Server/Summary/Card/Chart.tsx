import { Button } from 'baseui/button'
import { ButtonGroup } from 'baseui/button-group'
import { Card } from 'baseui/card'
import { ChartData, ChartType } from 'chart.js'
import { useEffect, useState } from 'react'
import { Chart } from 'react-chartjs-2'
import { styled } from 'styletron-react'

const StyledCard = styled(Card, {
  width: '100%',
  height: '100%',
})

const devData: ChartData = {
  labels: ['13:00', '14:00', '15:00', '16:00', '17:00'],

  datasets: [
    {
      label: 'CPU Usage',
      data: [65, 59, 80, 81, 56, 55, 40],
      borderWidth: 1,
      backgroundColor: ['#ffffff'],
      borderColor: ['#ffffff'],
    },
  ],
}

const chartTypes = ['line', 'bar'] as const

export const ChartCard: React.VFC<{ defaultType?: ChartType }> = ({ defaultType = 'line' }) => {
  const [chart, setChart] = useState<React.ReactNode | undefined>(<Chart type={defaultType} data={devData} />)
  const [type, setType] = useState<ChartType>(defaultType)

  useEffect(() => {
    setChart(<Chart type={type} data={devData} />)
  }, [type])

  return (
    <StyledCard>
      <ButtonGroup size="mini">
        {chartTypes.map((t) => (
          <Button
            key={t}
            onClick={() => {
              if (t === type) return
              setChart(undefined)
              setType(t)
            }}
          >
            {t}
          </Button>
        ))}
      </ButtonGroup>
      {chart}
    </StyledCard>
  )
}
