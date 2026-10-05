import { LearningVideo } from '../lib/learning-videos';

export function VideoReferences({videos}:{videos:(LearningVideo & {focus:string})[]}) {
  if(!videos.length)return null;
  return <section className="card card-pad teaching-section video-section" aria-labelledby="video-heading">
    <div className="eyebrow">OPTIONAL VIDEO SUPPORT</div>
    <h2 id="video-heading">Learn this topic on YouTube</h2>
    <p>Start with the first recommendation. Use the video’s chapters to find the idea you need, then return and try the lesson task yourself.</p>
    <div className="video-reference-grid">{videos.map((video,index)=><div className="video-reference" key={video.id}>
      <div className="video-meta"><span>{index===0?'Start here':'Go deeper'}</span><span>{video.format}</span></div>
      <h3><a href={video.url} target="_blank" rel="noopener noreferrer">{video.title} <span aria-label="opens YouTube in a new tab">↗</span></a></h3>
      <div className="video-channel">{video.channel}</div>
      <p>{video.focus}</p>
      <details><summary>Before following along</summary><p>{video.note}</p></details>
    </div>)}</div>
    <small className="progress-disclosure">Chosen for topic fit using publisher descriptions and course materials. Titles and channels checked {videos[0].checkedOn}. Videos are optional; watching does not mark the lesson complete.</small>
  </section>;
}
