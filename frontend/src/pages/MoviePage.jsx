import React, {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'

const apiKey = 'd93ed21e'

export default function MoviePage () {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    let cancelled = false
    ;(async ()=>{
      try{
        setIsLoading(true)
        const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${encodeURIComponent(id)}&plot=full`)
        const data = await res.json()
        if(cancelled) return
        if(data.Response === 'False'){
          setStatus(data.Error || 'Not found')
          setMovie(null)
          setIsLoading(false)
        } else {
          setMovie(data)
          setStatus('')
          setIsLoading(false)
        }
      }catch(e){
        if(!cancelled) {
          setStatus('Error loading')
          setIsLoading(false)
        }
      }
    })()
    return ()=>{ cancelled = true }
  },[id])

  if (isLoading) {
    return (
      <main className="container main-content">
        <div style={{display:'flex',gap:16,alignItems:'flex-start'}}>
          <div className="skeleton-img skeleton-animate" style={{width:260, borderRadius:8}} />
          <div style={{flex:1}}>
            <div className="skeleton-line skeleton-animate" style={{width:'60%', height:26, marginBottom:12}} />
            <div className="skeleton-line skeleton-animate" style={{width:'30%'}} />
            <div className="skeleton-line skeleton-animate" style={{width:'80%', height:12, marginTop:12}} />
            <div className="skeleton-line skeleton-animate" style={{width:'80%', height:12}} />
            <div className="skeleton-line skeleton-animate" style={{width:'40%', height:12, marginTop:12}} />
          </div>
        </div>
      </main>
    )
  }

  if(status) return <div className="container"><p className="status">{status}</p></div>
  if(!movie) return <div className="container"><p className="status">No movie found.</p></div>

  return (
    <main className="container main-content">
      <div style={{display:'flex',gap:16,alignItems:'flex-start'}}>
        <img src={movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/300x450/111827/ffffff?text=No+Image'} alt={movie.Title} style={{width:260}}/>
        <div>
          <h1>{movie.Title} ({movie.Year})</h1>
          <p><strong>Type:</strong> {movie.Type}</p>
          <p><strong>Runtime:</strong> {movie.Runtime}</p>
          <p>{movie.Plot}</p>
          <p><strong>Director:</strong> {movie.Director}</p>
          <p><strong>Actors:</strong> {movie.Actors}</p>
          <p><Link to="/">← Back</Link></p>
        </div>
      </div>
    </main>
  )
}
