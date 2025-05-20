import React from 'react';

export default function DMCA() {
  return (
    <div className="container-fluid py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">DMCA Policy</h1>
        
        <div className="bg-[var(--secondary)] p-6 rounded-lg shadow-lg mb-8">
          <p className="text-gray-300 mb-6">
            Last Updated: May 18, 2025
          </p>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">1. Introduction</h2>
              <p>
                JFlix respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we will respond expeditiously to claims of copyright infringement that are reported to our designated copyright agent.
              </p>
              <p className="mt-2 bg-gray-800 p-3 rounded-md border-l-4 border-[var(--primary)]">
                <strong>Important Notice:</strong> JFlix is NOT a content hosting service. We do not host, upload, store, or distribute any content on our servers. JFlix functions solely as an indexing service that provides links to content that is hosted exclusively on third-party servers and websites over which we have no control or affiliation. All content accessible through our service is the property of their respective owners and third-party content providers.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">2. Notification of Claimed Infringement</h2>
              <p>
                While JFlix does not host any content directly and only provides links to third-party websites, we still take copyright concerns seriously. If you believe that your copyrighted work has been improperly linked on our service in a way that constitutes copyright infringement, please notify our copyright agent as set forth in the DMCA. For your complaint to be valid under the DMCA, you must provide the following information in writing:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>An electronic or physical signature of a person authorized to act on behalf of the copyright owner;</li>
                <li>Identification of the copyrighted work that you claim has been infringed;</li>
                <li>Identification of the material that is claimed to be infringing and where it is located on the service;</li>
                <li>Information reasonably sufficient to permit JFlix to contact you, such as your address, telephone number, and email address;</li>
                <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or law; and</li>
                <li>A statement, made under penalty of perjury, that the above information is accurate, and that you are the copyright owner or are authorized to act on behalf of the owner.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">3. Counter-Notification</h2>
              <p>
                If you believe that your content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law, to post and use the material in your content, you may send a counter-notification containing the following information to our copyright agent:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Your physical or electronic signature;</li>
                <li>Identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled;</li>
                <li>A statement that you have a good faith belief that the content was removed or disabled as a result of mistake or a misidentification of the content; and</li>
                <li>Your name, address, telephone number, and email address, a statement that you consent to the jurisdiction of the federal court in [your jurisdiction], and a statement that you will accept service of process from the person who provided notification of the alleged infringement.</li>
              </ul>
              <p className="mt-2">
                If a counter-notification is received by our copyright agent, JFlix may send a copy of the counter-notification to the original complaining party informing that person that it may replace the removed content or cease disabling it in 10 business days. Unless the copyright owner files an action seeking a court order against the content provider, member or user, the removed content may be replaced, or access to it restored, in 10 to 14 business days or more after receipt of the counter-notice, at JFlix's sole discretion.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">4. Repeat Infringers</h2>
              <p>
                JFlix will promptly terminate without notice the accounts of users that are determined by JFlix to be "repeat infringers." A repeat infringer is a user who has been notified of infringing activity more than twice and/or has had content removed from the service more than twice.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">5. Contact Information</h2>
              <p>
                Please contact our designated agent for notice of claimed infringement at:
              </p>
              <div className="bg-gray-800 p-4 rounded-md mt-2">
                <p>Email: dmca@jflix-streaming.com</p>
                <p>Subject Line: DMCA Notice</p>
              </div>
              <p className="mt-2">
                Please note that the DMCA provides that you may be liable for damages (including costs and attorneys' fees) if you materially misrepresent that material or activity is infringing your copyrights. We suggest that you consult your legal advisor before filing a notice or counter-notice.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
