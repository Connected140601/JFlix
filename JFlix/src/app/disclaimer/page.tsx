import React from 'react';

export default function Disclaimer() {
  return (
    <div className="container-fluid py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Disclaimer</h1>
        
        <div className="bg-[var(--secondary)] p-6 rounded-lg shadow-lg mb-8">
          <p className="text-gray-300 mb-6">
            Last Updated: May 18, 2025
          </p>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">1. Content Disclaimer</h2>
              <p>
                JFlix is <strong>NOT</strong> a content hosting service. We are merely an index and link aggregator that provides links to content hosted exclusively on third-party servers and websites over which we have no control or affiliation. We do not host, upload, store, distribute, or share ANY content on our own servers. All content accessible through our service is the property of their respective owners and third-party content providers.
              </p>
              <p className="mt-2">
                JFlix functions solely as a search engine of links that are made available by third parties on the internet. We have no control over the content of these third-party websites.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">2. No Endorsement</h2>
              <p>
                The presence of any content on our platform does not constitute an endorsement, recommendation, or approval by JFlix. We do not guarantee the accuracy, completeness, or usefulness of any content available through our service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">3. Adult Content Warning</h2>
              <p>
                JFlix provides access to adult content that is intended for mature audiences only. Users must be at least 18 years of age to access such content. We implement age verification measures, but it is ultimately the user's responsibility to ensure they meet the age requirements.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">4. Use at Your Own Risk</h2>
              <p>
                Your use of JFlix and any content accessed through our service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. JFlix makes no warranties or representations about the content's quality, suitability, or legality.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">5. Third-Party Links</h2>
              <p>
                Our service may contain links to third-party websites or services that are not owned or controlled by JFlix. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">6. Copyright and Intellectual Property</h2>
              <p>
                JFlix respects the intellectual property rights of others and takes matters of copyright infringement very seriously. We do not claim ownership of any content that is accessed through our service. All streaming links are provided by third parties, and we have no involvement in the creation, uploading, hosting, or distribution of any content.
              </p>
              <p className="mt-2">
                <strong>Important:</strong> JFlix does not upload, host, or distribute any content. We simply provide links to content that is already available on third-party servers across the internet. We do not have the ability to control what content these third-party sites make available or remove.
              </p>
              <p className="mt-2">
                If you believe that your work has been copied in a way that constitutes copyright infringement, please refer to our DMCA policy for the proper procedure to notify us.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, JFlix, its affiliates, employees, agents, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">8. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless JFlix and its licensors, service providers, and affiliates from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees arising out of or relating to your violation of these terms or your use of the service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-white">9. Changes to This Disclaimer</h2>
              <p>
                JFlix reserves the right to modify or replace this disclaimer at any time. It is your responsibility to check this disclaimer periodically for changes.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
