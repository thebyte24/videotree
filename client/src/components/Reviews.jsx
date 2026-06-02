import { motion } from 'framer-motion'
import './Reviews.css'

const reviews = [
  {
    name: 'hemanth photography (raj)',
    rating: 5,
    text: 'Very professional team. The livestream was super smooth with no buffering or technical issues. The setup was perfect and on time. Thank you, Video Tree, for making our day special for everyone!',
  },
  {
    name: 'Suryanarayana Reddy',
    rating: 5,
    text: 'Memories are made more colourful with Video Tree.',
  },
  {
    name: 'Vinod Krishna',
    rating: 5,
    text: 'One of the best photography and video coverage in Vizag. Candid teaser and video mixing was done very well. Much recommended.',
  },
  {
    name: 'Prudhvi Akhil',
    rating: 5,
    text: 'One of the best video and photography shops in vizag, i had great experience. Skilled, very passionate, creative and very patient crew. I give 5 stars for them and for their hard work. 👏👏',
  },
  {
    name: 'SRINIVASA RAO SVS',
    rating: 5,
    text: 'Best video quality P3 Led Wall in visakhapatnam.',
  },
  {
    name: 'S Phaneendrachari Maroju',
    rating: 5,
    text: "I first visited and I thought they won't give best output..but I wonder after their marriage live..without any frame drops they give best live telecast..vizag's best studio.",
  },
  {
    name: 'Upendranaidu Banna',
    rating: 5,
    text: 'Vizag 4K editing Output Best studio.',
  },
  {
    name: 'bhaskar yadav',
    rating: 5,
    text: 'Best live streaming in visakhapatnam.',
  },
  {
    name: 'Shaik Samsuddin',
    rating: 5,
    text: 'Best livestreaming in Visakhapatnam.',
  },
  {
    name: 'Dasari Venkatesh',
    rating: 5,
    text: 'One of the best live streaming.',
  },
  {
    name: 'lalam mahesh',
    rating: 5,
    text: 'Good experience...',
  },
  {
    name: 'Suresh Vaska',
    rating: 5,
    text: 'Vizag number 1 live streaming.',
  },
]

function Stars({ count }) {
  return (
    <div className="reviews__stars">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f5c518">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  return (
    <section className="reviews">
      <motion.div
        className="reviews__header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="reviews__label">Google Reviews</p>
        <h2 className="reviews__title">What Our Clients Say</h2>
      </motion.div>

      <div className="reviews__track-wrap">
        <div className="reviews__track">
          {[...reviews, ...reviews].map((r, i) => (
            <div className="reviews__card" key={i}>
              <div className="reviews__avatar">{r.name.charAt(0)}</div>
              <p className="reviews__name">{r.name}</p>
              <Stars count={r.rating} />
              <p className="reviews__text">"{r.text}"</p>
              <a
                href="https://www.justdial.com/Visakhapatnam/Video-Tree-Opposite-Thondam-Vinayaka-Temple-Beside-World-Tours-Travels-Lalitha-Nagar/0891PX891-X891-000060679220-F8X8_BZDETthis"
                target="_blank"
                rel="noopener noreferrer"
                className="reviews__more"
              >
                Tap to see more reviews
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
