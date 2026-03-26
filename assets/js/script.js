console.log("Its working!");



const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const intersecting = entry.isIntersecting
    entry.target.style.backgroundColor = intersecting ? "blue" : "orange"
  })
})

observer.observe(document.getElementById("test"))

