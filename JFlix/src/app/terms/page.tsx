import React from 'react';

export default function TermsOfService() {
  return (
    <div className="container-fluid py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
        
        <div className="bg-[var(--secondary)] p-6 rounded-lg shadow-lg mb-8">
          <p className="text-gray-300 mb-6">
            Last Updated: May 18, 2025
          </p>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing or using JFlix streaming service, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">2. Description of Service</h2>
              <p>
                JFlix is an indexing service that provides links to content hosted exclusively on third-party servers. We do not host, store, upload, or distribute any content on our own servers. Our service merely aggregates and organizes links to content that is already publicly available on third-party websites across the internet.
              </p>
              <p className="mt-2">
                The content accessible through our service includes movies, TV shows, Korean dramas, anime, and adult content, all of which is hosted on external third-party servers over which we have no control. The service is provided "as is" and may change without prior notice.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">3. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You must be at least 18 years old to access certain content marked as age-restricted.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">4. Content and Copyright</h2>
              <p>
                <strong>JFlix does not host, upload, store, or distribute any content on its servers.</strong> We function solely as a search engine of links that are made available by third parties on the internet. All content is provided by and hosted on third-party servers and websites over which we have no control or affiliation.
              </p>
              <p className="mt-2">
                JFlix has no ability to control the content that third-party websites make available. We do not create, upload, or distribute any of the content that may be accessed through the links on our platform. All such content is the property and responsibility of the third-party websites that host it.
              </p>
              <p className="mt-2">
                JFlix respects intellectual property rights and takes copyright infringement seriously. We comply with the Digital Millennium Copyright Act (DMCA) and will respond to notices of alleged copyright infringement that comply with applicable law. If you believe your copyrighted work has been improperly linked on our service, please refer to our DMCA Policy for the proper procedure to notify us.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">5. User Conduct</h2>
              <p>
                You agree not to use the service for any illegal purposes or in violation of any local, state, national, or international law. You also agree not to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Attempt to bypass any age verification measures</li>
                <li>Distribute or share content from the platform</li>
                <li>Use any automated system to access the service</li>
                <li>Attempt to reverse engineer any aspect of the service</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">6. Termination</h2>
              <p>
                JFlix reserves the right to terminate or suspend your access to the service immediately, without prior notice or liability, for any reason, including breach of these Terms of Service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">7. Limitation of Liability</h2>
              <p>
                In no event shall JFlix, its operators, affiliates, or content providers be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">8. Changes to Terms</h2>
              <p>
                JFlix reserves the right to modify or replace these Terms of Service at any time. It is your responsibility to check these Terms periodically for changes.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">9. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us through the support channels provided on the website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
