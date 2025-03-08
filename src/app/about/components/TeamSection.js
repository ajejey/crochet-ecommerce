import Image from 'next/image';
import Link from 'next/link';

export default function TeamSection() {
  const teamMembers = [
    {
      name: 'Ajey Nagarkatti',
      role: 'Co-founder & Platform Creator',
      bio: 'Ajey created KnitKart to bridge the gap between traditional craftsmanship and modern markets, leveraging his expertise in technology and e-commerce.',
      image: '/images/team-founder.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
      }
    },
    {
      name: 'Anuradha Bengoor',
      role: 'Co-founder & Master Artisan',
      bio: 'With over 30 years of crochet experience, Anuradha brings authentic craftsmanship and deep knowledge of traditional techniques to the KnitKart platform.',
      image: '/images/team-creative.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
      }
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            The passionate individuals behind KnitKart who are dedicated to our mission of supporting artisans and preserving craft traditions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
              <div className="relative h-64 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-rose-600 mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="flex space-x-3">
                  <a href={member.social.linkedin} className="text-gray-400 hover:text-rose-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href={member.social.twitter} className="text-gray-400 hover:text-rose-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory Board */}
        {/* <div className="mt-24">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-8 text-center">Our Advisory Board</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/advisor-1.jpg"
                  alt="Dr. Meera Krishnan"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Dr. Meera Krishnan</h4>
              <p className="text-rose-600 text-sm mb-2">Textile Conservation Expert</p>
              <p className="text-gray-600 text-sm">
                Former curator at the National Crafts Museum with expertise in preserving traditional craft techniques.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/advisor-2.jpg"
                  alt="Rajiv Chandran"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Rajiv Chandran</h4>
              <p className="text-rose-600 text-sm mb-2">E-commerce Pioneer</p>
              <p className="text-gray-600 text-sm">
                Co-founder of multiple successful e-commerce ventures and angel investor in artisan-focused businesses.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/advisor-3.jpg"
                  alt="Lakshmi Devi"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Lakshmi Devi</h4>
              <p className="text-rose-600 text-sm mb-2">Master Craftswoman</p>
              <p className="text-gray-600 text-sm">
                Award-winning crochet artist with over 40 years of experience, providing invaluable craftsmanship guidance.
              </p>
            </div>
          </div>
        </div> */}

        {/* Join Team CTA */}
        <div className="mt-20 bg-rose-50 rounded-2xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Team</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Are you passionate about Indian crafts, technology, or creating sustainable livelihoods for artisans?
            We're always looking for talented individuals to join our mission.
          </p>
          <Link href="/careers" className="inline-block px-8 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-300">
            View Open Positions
          </Link>
        </div>
      </div>
    </section>
  );
}
