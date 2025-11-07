import ExploreBtn from "@/components/ExploreBtn";

const page = () => {
  return (
      <section>
    <h1 className="text-center">The Hub for Every Dev<br />Event you can't miss</h1>

      <p className = 'text-center mt-5'>Hackathon , Meetups and Conferences , All in one place
      </p><ExploreBtn/>
          <div className ='mt-20 space-y-7'> </div>
          <h3>Featured Events</h3>
          <ul className= 'events'>
              {[1,2,3,4,5].map((event) => (
                  <li key ={event}>Event {event} </li>
              ))}
          </ul>
      </section>
  )
}

export default page