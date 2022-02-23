import { PluginType } from 'bacon-types'
import { useStyletron } from 'baseui'
import { HeadingLarge } from 'baseui/typography'
import { useEffect, useState } from 'react'
import { useServer } from '..'
import { Downloader } from './Downloader'

import { PluginList } from './PluginList'
import { Uploader } from './Uploader'

export const Plugins: React.VFC = () => {
  const [css] = useStyletron()
  const [server] = useServer()
  const [plugins, setPlugins] = useState<PluginType[] | null>(null)

  const updatePlugins = async () => {
    try {
      const plugins = await server.getPlugins()
      setPlugins(plugins)
    } catch (error) {
      setPlugins([])
    }
  }

  useEffect(() => {
    updatePlugins()
  }, [])
  
  return (
    <div className={css({
      display: 'flex',
      alignItems: 'flex-start'
    })}>
      <PluginList plugins={plugins} onDelete={updatePlugins} />

      <div
        className={css({
          width: '30%',
        })}
      >
        <Downloader onDownloaded={updatePlugins} />
        <Uploader onUploaded={updatePlugins} />
      </div>
    </div>
  )
}
