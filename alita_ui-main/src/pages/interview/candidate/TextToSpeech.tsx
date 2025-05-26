import AudioPlayer from '@lobehub/tts/es/react/AudioPlayer';
import { useEdgeSpeech } from '@lobehub/tts/es/react/useEdgeSpeech';
import { useEffect, useState } from 'react';

const TextToSpeech = ({ text }: any) => {
  const { setText, isGlobalLoading, start, stop, audio } = useEdgeSpeech('Edge Speech Example', {
    api: {},
    options: {
      voice: 'en-US-JennyNeural',
    },
  });

  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    setText(text.replace(/[.|?]/g, ''));
  }, [text])

  const t: any = {}

  const startGen = () => {
    start()
    setShow(true)
  }

  return (<>
    <div>
      <div style={{ position: 'relative' }}>
        <div onClick={startGen} style={{ display: show ? 'none' : 'block', padding: '0 10px' }}>
          <AudioPlayer audio={t} showDonload={false} showTime={false} />
        </div>
        <div style={{
          top: 0, right: 0, left: 0, padding: '0 10px',
          display: show ? 'block' : 'none'
        }}>
          {show && <div>
            <AudioPlayer audio={audio} isLoading={isGlobalLoading} onLoadingStop={stop}
              showDonload={false} showTime={false} />
          </div>}
        </div>
      </div>
    </div>
  </>);
};

export default TextToSpeech;