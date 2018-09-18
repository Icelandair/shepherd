const loader = require('.')(inject({
     kubeSupportedExtensions : {
        '.yml':true,
        '.yaml':true,
        '.json':true
    }
}));


describe('Docker image plan loader', function () {

    let loadedPlan, loadedPlans;

    function loadPlan(dockerDeployerMetadata) {

        return new Promise(function(resolve, reject){
            let loaderPromise = loader(dockerDeployerMetadata);
            loaderPromise.then(function (plans) {
                loadedPlan = plans[0];
                loadedPlans = plans;
                resolve(plans);
            }).catch(function (err) {
                reject(err);
            });
            return loaderPromise;
        });
    }


    it('should load module', function () {
        expect(loader).to.be.ok()
    });


    describe('image deployer', function () {


        let dockerDeployerMetadata = {
            imageDefinition: {
                herdName: 'testimage',
                image: 'testenvimage-migrations',
                imagetag: '0.0.0'
            },
            dockerLabels: {
                "is.icelandairlabs.builddate": "Tue 26 Dec 14:52:52 GMT 2017",
                "is.icelandairlabs.deployer": "true",
                "is.icelandairlabs.deployer.command": "ls",
                "is.icelandairlabs.deployer.environment": "THIS_IS_DEPLOYER_ONE=true",
                "is.icelandairlabs.environment.variables": "EXPORT1=${EXPORT1},DB_PASS=$MICRO_SITES_DB_PASSWORD",
                "is.icelandairlabs.git.branch": "master",
                "is.icelandairlabs.git.hash": "b14892def916aa1fffa9728a5d58f7359f982c02",
                "is.icelandairlabs.git.url": "https://github.com/Icelandair/shepherd.git",
                "is.icelandairlabs.lastcommits": "VGh1LCAyMSBEZWMgMjAxNyAxMDo0NTo0NSArMDAwMCBieSBHdcOwbGF1Z3VyIFMuIEVnaWxzc29u\nLiAtLS0gQmV0dGVyIHVzZSByaWdodCBtYWtlIHRhcmdldCBXZWQsIDIwIERlYyAyMDE3IDE4OjE1\nOjUwICswMDAwIGJ5IEd1w7BsYXVndXIgUy4gRWdpbHNzb24uIC0tLSBBIGxpdHRsZSB0cmlja2Vy\neSB0byBtYWtlIGphc21pbmUgcnVubmFibGUgd2l0aCBzcmMgZGlyIG1hcHBlZCBpbiBkb2NrZXIt\nY29tcG9zZS4gV2VkLCAyMCBEZWMgMjAxNyAxNzoxMDozOCArMDAwMCBieSBHdcOwbGF1Z3VyIFMu\nIEVnaWxzc29uLiAtLS0gSmVua2lucyBqb2IgY2Fubm90IHVzZSAtaXQgV2VkLCAyMCBEZWMgMjAx\nNyAxNjo1OToxMyArMDAwMCBieSBHdcOwbGF1Z3VyIFMuIEVnaWxzc29uLiAtLS0gQWxsIHRlc3Rz\nIG5vdyBydW5uaW5nIGluIGRvY2tlciBpbWFnZXMuIEFkZGVkIEplbmtpbnNmaWxlLiBQbHVzIGxv\ndHMgb2Ygc21hbGxlciBpbXByb3ZlbWVudHMvY2hhbmdlcy4gV2VkLCAyMCBEZWMgMjAxNyAwOToz\nMToxMCArMDAwMCBieSBHdcOwbGF1Z3VyIEVnaWxzc29uIEBndWxsaS4gLS0tIFJlc29sdmUgdG9k\nbywgZXhpdCB3aXRoIGVycm9yIGlmIGltYWdlIHNwZWNpZmllZCBpcyBub3QgYWN0aW9uYWJsZS4K",
                "is.icelandairlabs.name": "Testimage",
                "is.icelandairlabs.version": "0.0.0"
            }
        };

        describe('with command specified', function () {

            beforeEach(function (done) {
                process.env.EXPORT1 = 'export1';
                process.env.MICRO_SITES_DB_PASSWORD = 'pass';
                loadPlan(dockerDeployerMetadata).then(function () {
                    done();
                }).catch(fail);
            });

            afterEach(function () {
                delete process.env.EXPORT1;
                delete process.env.MICRO_SITES_DB_PASSWORD;
            });

            it('should extract wanted environment variables from image metadata', function () {
                expect(loadedPlan).to.be.ok();
            });

            it('should have image', function () {
                expect(loadedPlan.dockerParameters).to.contain('testenvimage-migrations:0.0.0')
            });

            it('should extract is.icelandairlabs.deployer.command and use as plan command', function () {
                expect(loadedPlan.command).to.be('ls')
            });

            it('should add plan command as last parameter', function () {
                expect(loadedPlan.dockerParameters[loadedPlan.dockerParameters.length-1]).to.be('ls')
            });

            it('should have herdName', function () {
                expect(loadedPlan.herdName).to.be('testimage');
            });

        });

        describe('no command specified', function () {

            let dockerDeployerMetadata = {
                imageDefinition: {
                    herdName: 'testimage',
                    image: 'testenvimage-migrations',
                    imagetag: '0.0.0'
                },
                dockerLabels: {
                    "is.icelandairlabs.builddate": "Tue 26 Dec 14:52:52 GMT 2017",
                    "is.icelandairlabs.deployer": "true",
                    "is.icelandairlabs.deployer.environment": "THIS_IS_DEPLOYER_ONE=true",
                    "is.icelandairlabs.environment.variables": "EXPORT1=${EXPORT1},DB_PASS=$MICRO_SITES_DB_PASSWORD",
                    "is.icelandairlabs.git.branch": "master",
                    "is.icelandairlabs.git.hash": "b14892def916aa1fffa9728a5d58f7359f982c02",
                    "is.icelandairlabs.git.url": "https://github.com/Icelandair/shepherd.git",
                    "is.icelandairlabs.lastcommits": "VGh1LCAyMSBEZWMgMjAxNyAxMDo0NTo0NSArMDAwMCBieSBHdcOwbGF1Z3VyIFMuIEVnaWxzc29u\nLiAtLS0gQmV0dGVyIHVzZSByaWdodCBtYWtlIHRhcmdldCBXZWQsIDIwIERlYyAyMDE3IDE4OjE1\nOjUwICswMDAwIGJ5IEd1w7BsYXVndXIgUy4gRWdpbHNzb24uIC0tLSBBIGxpdHRsZSB0cmlja2Vy\neSB0byBtYWtlIGphc21pbmUgcnVubmFibGUgd2l0aCBzcmMgZGlyIG1hcHBlZCBpbiBkb2NrZXIt\nY29tcG9zZS4gV2VkLCAyMCBEZWMgMjAxNyAxNzoxMDozOCArMDAwMCBieSBHdcOwbGF1Z3VyIFMu\nIEVnaWxzc29uLiAtLS0gSmVua2lucyBqb2IgY2Fubm90IHVzZSAtaXQgV2VkLCAyMCBEZWMgMjAx\nNyAxNjo1OToxMyArMDAwMCBieSBHdcOwbGF1Z3VyIFMuIEVnaWxzc29uLiAtLS0gQWxsIHRlc3Rz\nIG5vdyBydW5uaW5nIGluIGRvY2tlciBpbWFnZXMuIEFkZGVkIEplbmtpbnNmaWxlLiBQbHVzIGxv\ndHMgb2Ygc21hbGxlciBpbXByb3ZlbWVudHMvY2hhbmdlcy4gV2VkLCAyMCBEZWMgMjAxNyAwOToz\nMToxMCArMDAwMCBieSBHdcOwbGF1Z3VyIEVnaWxzc29uIEBndWxsaS4gLS0tIFJlc29sdmUgdG9k\nbywgZXhpdCB3aXRoIGVycm9yIGlmIGltYWdlIHNwZWNpZmllZCBpcyBub3QgYWN0aW9uYWJsZS4K",
                    "is.icelandairlabs.name": "Testimage",
                    "is.icelandairlabs.version": "0.0.0"
                }
            };


            beforeEach(function (done) {
                process.env.EXPORT1 = 'export1';
                process.env.MICRO_SITES_DB_PASSWORD = 'pass';
                loadPlan(dockerDeployerMetadata).then(function () {
                    done();
                }).catch(fail);
            });

            afterEach(function () {
                delete process.env.EXPORT1;
                delete process.env.MICRO_SITES_DB_PASSWORD;
            });

            it('should use deploy as default command', function () {
                expect(loadedPlan.dockerParameters[loadedPlan.dockerParameters.length-1]).to.be('deploy')
            });

        });


        describe('missing env variables', function () {

            it('should fail with message indicating label containing problematic env reference.', function (done) {
                loadPlan(dockerDeployerMetadata).then(function(loadedPlan){
                    done.fail('Not expecting to load plan successfully');
                }).catch(function (err) {
                    expect(err.toString()).to.contain('Reference to environment variable');
                    done();
                });
            });

        });
    });

    describe('k8s deployment using base64 tar', function () {

        let dockerImageMetadata ={
            imageDefinition: {
                herdName: 'testimage',
                image: 'testenvimage-migrations',
                imagetag: '0.0.0'
            },
            dockerLabels:{
                "is.icelandairlabs.builddate": "Tue 26 Dec 14:52:54 GMT 2017",
                "is.icelandairlabs.dbmigration": "testenvimage-migrations:0.0.0",
                "is.icelandairlabs.git.branch": "master",
                "is.icelandairlabs.git.hash": "b14892def916aa1fffa9728a5d58f7359f982c02",
                "is.icelandairlabs.git.url": "https://github.com/Icelandair/shepherd.git",
                "is.icelandairlabs.kube.config.tar.base64": "H4sIAEZiQloAA+1XTXPiOBDlzK9QpXLaKoFtDEz5RhLPrmvCRwEzmRsl7A5Rxba8sgyhsvnvK9t8\nGBsCSSbJTq3fBSy1XkvqVuupVncgcNnSA1/UK+8DRaLdbsa/arupZn/XqKgNTW21G0qrqVcUVdM1\npYKa7zSfHUShIByhyixyXfqM3bH+3xS1bPwXiwWmNrjEdwjl2GZebdtbW3ru63zEAW619EPxbzR0\nbTf+mqqozQpSfu1S9+N/Hn8S0B/AQ8p8A8GDAD/+G9bn6hQEUav31HcMdLVJgqonmx0iiFFFyCce\nGKiYNLLLJVNww9joWTOEBAVuoFvOfOnbqYYB2PEoLj1Sm4QG0uSXAC9wiYCULzuFGFlfR/3t8Rk3\nrf3GoB6ZwUCGewQ2B5Fhxituh9n3wDGHGQ0FX+JAGuMwsV7Z2pKbUF/ubHZ0wmyg88fx4Hpy1b/8\nZg4nVrfzp/m0MTph+vHuhCziNmTIk42gHhW5NjmVIDKQUvuSa/bAY3xpoKaqdXe6OPwdQXiQRz/A\nozVbWZ6A8TwF3u7KQPYa6Iua40qXfidEgAPOHpa5btkmmM1cA40vB89T63p+nlvu8EXkc+ZGHnRZ\n5BfXk3JuwyQzMcQ2yJXnyDkQp++7cpsEjyC/gzH3gIg7A53Vk9H1XcqzvW79GfUfMLHd1zsDYdcT\nmnpMU8/6AX++f7XD772x1TUnZu+HNez3umZvnHMxJ24EXznz8hmUHItbOuuS4Bssh3BbNFjH6fzR\n/DnoD8fq0x6Te5Brk/6LJyt7piaj0fCEY4XDkL/xaLU+7mil2binJB1JwrQ47fpN23rJ8PgSxHkO\nuTkxD72VlVhAweXeBNxEeNfXwd0/kMVUlvzCNuE08os72evKyltIjSDJ601/LZ5M9bNv2P82jum/\nEPhcNr1e/FWO6j9Nfub0n6JJ81L/fQCy+m++1nujNOinij3i+0wQEQtHA6VyapU1sYis3UdT4D4I\nCGuU1ckixC4jDp4SySLrS3ob4+39e/bH2UsUZBhNHebJuz++NUbfL6Sw6nas3mQwNL9aP5/iKaRK\nkwVbu7TTvJqM+4P1gF6nuxJiAognBaJLg40gFctATuFaTvxiNe9qRuTg5K9UNEo6nvAZiB2Rk5c2\nm/VmRut6ozB8LWQK8iVLEIILtmD85XobY1z91SlQZsDvlAGfXYBKfCqO3P+YyizhPnHfIgSO3P9K\nQ2/m7n9NVdrl/f8ReHPx32TIiRV7a78urIUaqsZJkat5ZY17HxzT/+l77k3y/+j5l+/bvP5XlUZ5\n/j8Ce8//5foRf1oF2HnDZ2tARkWtSTaPcwP9gxOj88cLEkJLvwKbOWDc3NxMrEvzutO76ljDiTWY\n3Pxljc1razR+Kg9yiRIlSpQoUaJEiRIlSrwa/wJ4qk95ACgAAA==",
                "is.icelandairlabs.lastcommits": "VGh1LCAyMSBEZWMgMjAxNyAxMDo0NTo0NSArMDAwMCBieSBHdcOwbGF1Z3VyIFMuIEVnaWxzc29u\nLiAtLS0gQmV0dGVyIHVzZSByaWdodCBtYWtlIHRhcmdldCBXZWQsIDIwIERlYyAyMDE3IDE4OjE1\nOjUwICswMDAwIGJ5IEd1w7BsYXVndXIgUy4gRWdpbHNzb24uIC0tLSBBIGxpdHRsZSB0cmlja2Vy\neSB0byBtYWtlIGphc21pbmUgcnVubmFibGUgd2l0aCBzcmMgZGlyIG1hcHBlZCBpbiBkb2NrZXIt\nY29tcG9zZS4gV2VkLCAyMCBEZWMgMjAxNyAxNzoxMDozOCArMDAwMCBieSBHdcOwbGF1Z3VyIFMu\nIEVnaWxzc29uLiAtLS0gSmVua2lucyBqb2IgY2Fubm90IHVzZSAtaXQgV2VkLCAyMCBEZWMgMjAx\nNyAxNjo1OToxMyArMDAwMCBieSBHdcOwbGF1Z3VyIFMuIEVnaWxzc29uLiAtLS0gQWxsIHRlc3Rz\nIG5vdyBydW5uaW5nIGluIGRvY2tlciBpbWFnZXMuIEFkZGVkIEplbmtpbnNmaWxlLiBQbHVzIGxv\ndHMgb2Ygc21hbGxlciBpbXByb3ZlbWVudHMvY2hhbmdlcy4gV2VkLCAyMCBEZWMgMjAxNyAwOToz\nMToxMCArMDAwMCBieSBHdcOwbGF1Z3VyIEVnaWxzc29uIEBndWxsaS4gLS0tIFJlc29sdmUgdG9k\nbywgZXhpdCB3aXRoIGVycm9yIGlmIGltYWdlIHNwZWNpZmllZCBpcyBub3QgYWN0aW9uYWJsZS4K",
                "is.icelandairlabs.name": "Testimage",
                "is.icelandairlabs.version": "0.0.0"
            }
        };

        describe('successful load', function () {

            let loadedPlans;
            beforeEach(function (done) {
                process.env.EXPORT1 = 'na';
                process.env.SUB_DOMAIN_PREFIX = 'na';
                process.env.PREFIXED_TOP_DOMAIN_NAME = 'na';
                process.env.WWW_ICELANDAIR_IP_WHITELIST = 'YnVsbHNoaXRsaXN0Cg==';

                loadPlan(dockerImageMetadata).then(function (plans) {
                    loadedPlans = plans;
                    done();
                }).catch(function (error) {
                    console.debug('Failed to load plan', error);
                    done.fail(error);
                });
            });

            afterEach(function () {
                delete process.env.EXPORT1;
                delete process.env.SUB_DOMAIN_PREFIX;
                delete process.env.PREFIXED_TOP_DOMAIN_NAME;
            });

            it('should extract wanted environment variables from image metadata', function () {
                expect(loadedPlan).to.be.ok();
            });

            it('should have version', function () {
                expect(loadedPlan.version).to.be('0.0.0');
            });

            it('should contain origin in plan', function () {
                expect(loadedPlan.origin).to.be('testenvimage-migrations:0.0.0:kube.config.tar.base64');
            });

            it('should use apply as default operation', function () {
                expect(loadedPlan.operation).to.be('apply');
            });

            it('should return one plan per deployment file', function () {
                expect(loadedPlans.length).to.be(4);
            });

            it('should be of type k8s', function () {
                expect(loadedPlan.type).to.be('k8s');
            });

        });


        describe('missing env variable', function () {

            let loadError;
            beforeEach(function (done) {
                delete process.env.EXPORT1;
                loadPlan(dockerImageMetadata).then(function () {
                    expect().fail('Not expected to succeed!');
                }).catch(function (error) {
                    loadError = error;
                    done();
                });
            });


            it('should report filename in error', function () {
                expect(loadError).to.contain('./deployment/www-icelandair-com.deployment.yml');
            });

            it('should report origin in error', function () {
                expect(loadError).to.contain('testenvimage-migrations');
            });

            it('should report line in error', function () {
                expect(loadError).to.contain('line ');

            });
            it('should report variable in error', function () {
                expect(loadError).to.contain('${EXPORT1}');

            });
        });
    });


    describe('- feature - deployment to k8s using base64 tar', function () {

        let dockerImageMetadata ={
            imageDefinition: {
                herdName: 'thisIsFeatureDeploymentOne',
                image: 'testenvimage-migrations',
                imagetag: '0.0.0',
                featureDeployment: true,
                timeToLiveHours: 48
            },
            dockerLabels:{
                "is.icelandairlabs.builddate": "Tue 26 Dec 14:52:54 GMT 2017",
                "is.icelandairlabs.dbmigration": "testenvimage-migrations:0.0.0",
                "is.icelandairlabs.git.branch": "master",
                "is.icelandairlabs.git.hash": "b14892def916aa1fffa9728a5d58f7359f982c02",
                "is.icelandairlabs.git.url": "https://github.com/Icelandair/shepherd.git",
                "is.icelandairlabs.kube.config.tar.base64": "H4sIAEZiQloAA+1XTXPiOBDlzK9QpXLaKoFtDEz5RhLPrmvCRwEzmRsl7A5Rxba8sgyhsvnvK9t8\nGBsCSSbJTq3fBSy1XkvqVuupVncgcNnSA1/UK+8DRaLdbsa/arupZn/XqKgNTW21G0qrqVcUVdM1\npYKa7zSfHUShIByhyixyXfqM3bH+3xS1bPwXiwWmNrjEdwjl2GZebdtbW3ru63zEAW619EPxbzR0\nbTf+mqqozQpSfu1S9+N/Hn8S0B/AQ8p8A8GDAD/+G9bn6hQEUav31HcMdLVJgqonmx0iiFFFyCce\nGKiYNLLLJVNww9joWTOEBAVuoFvOfOnbqYYB2PEoLj1Sm4QG0uSXAC9wiYCULzuFGFlfR/3t8Rk3\nrf3GoB6ZwUCGewQ2B5Fhxituh9n3wDGHGQ0FX+JAGuMwsV7Z2pKbUF/ubHZ0wmyg88fx4Hpy1b/8\nZg4nVrfzp/m0MTph+vHuhCziNmTIk42gHhW5NjmVIDKQUvuSa/bAY3xpoKaqdXe6OPwdQXiQRz/A\nozVbWZ6A8TwF3u7KQPYa6Iua40qXfidEgAPOHpa5btkmmM1cA40vB89T63p+nlvu8EXkc+ZGHnRZ\n5BfXk3JuwyQzMcQ2yJXnyDkQp++7cpsEjyC/gzH3gIg7A53Vk9H1XcqzvW79GfUfMLHd1zsDYdcT\nmnpMU8/6AX++f7XD772x1TUnZu+HNez3umZvnHMxJ24EXznz8hmUHItbOuuS4Bssh3BbNFjH6fzR\n/DnoD8fq0x6Te5Brk/6LJyt7piaj0fCEY4XDkL/xaLU+7mil2binJB1JwrQ47fpN23rJ8PgSxHkO\nuTkxD72VlVhAweXeBNxEeNfXwd0/kMVUlvzCNuE08os72evKyltIjSDJ601/LZ5M9bNv2P82jum/\nEPhcNr1e/FWO6j9Nfub0n6JJ81L/fQCy+m++1nujNOinij3i+0wQEQtHA6VyapU1sYis3UdT4D4I\nCGuU1ckixC4jDp4SySLrS3ob4+39e/bH2UsUZBhNHebJuz++NUbfL6Sw6nas3mQwNL9aP5/iKaRK\nkwVbu7TTvJqM+4P1gF6nuxJiAognBaJLg40gFctATuFaTvxiNe9qRuTg5K9UNEo6nvAZiB2Rk5c2\nm/VmRut6ozB8LWQK8iVLEIILtmD85XobY1z91SlQZsDvlAGfXYBKfCqO3P+YyizhPnHfIgSO3P9K\nQ2/m7n9NVdrl/f8ReHPx32TIiRV7a78urIUaqsZJkat5ZY17HxzT/+l77k3y/+j5l+/bvP5XlUZ5\n/j8Ce8//5foRf1oF2HnDZ2tARkWtSTaPcwP9gxOj88cLEkJLvwKbOWDc3NxMrEvzutO76ljDiTWY\n3Pxljc1razR+Kg9yiRIlSpQoUaJEiRIlSrwa/wJ4qk95ACgAAA==",
                "is.icelandairlabs.lastcommits": "VGh1LCAyMSBEZWMgMjAxNyAxMDo0NTo0NSArMDAwMCBieSBHdcOwbGF1Z3VyIFMuIEVnaWxzc29u\nLiAtLS0gQmV0dGVyIHVzZSByaWdodCBtYWtlIHRhcmdldCBXZWQsIDIwIERlYyAyMDE3IDE4OjE1\nOjUwICswMDAwIGJ5IEd1w7BsYXVndXIgUy4gRWdpbHNzb24uIC0tLSBBIGxpdHRsZSB0cmlja2Vy\neSB0byBtYWtlIGphc21pbmUgcnVubmFibGUgd2l0aCBzcmMgZGlyIG1hcHBlZCBpbiBkb2NrZXIt\nY29tcG9zZS4gV2VkLCAyMCBEZWMgMjAxNyAxNzoxMDozOCArMDAwMCBieSBHdcOwbGF1Z3VyIFMu\nIEVnaWxzc29uLiAtLS0gSmVua2lucyBqb2IgY2Fubm90IHVzZSAtaXQgV2VkLCAyMCBEZWMgMjAx\nNyAxNjo1OToxMyArMDAwMCBieSBHdcOwbGF1Z3VyIFMuIEVnaWxzc29uLiAtLS0gQWxsIHRlc3Rz\nIG5vdyBydW5uaW5nIGluIGRvY2tlciBpbWFnZXMuIEFkZGVkIEplbmtpbnNmaWxlLiBQbHVzIGxv\ndHMgb2Ygc21hbGxlciBpbXByb3ZlbWVudHMvY2hhbmdlcy4gV2VkLCAyMCBEZWMgMjAxNyAwOToz\nMToxMCArMDAwMCBieSBHdcOwbGF1Z3VyIEVnaWxzc29uIEBndWxsaS4gLS0tIFJlc29sdmUgdG9k\nbywgZXhpdCB3aXRoIGVycm9yIGlmIGltYWdlIHNwZWNpZmllZCBpcyBub3QgYWN0aW9uYWJsZS4K",
                "is.icelandairlabs.name": "Testimage",
                "is.icelandairlabs.version": "0.0.0"
            }
        };

        describe('successful load', function () {

            let loadedPlans;
            beforeEach(function (done) {
                process.env.EXPORT1 = 'na';
                process.env.SUB_DOMAIN_PREFIX = 'na';
                process.env.PREFIXED_TOP_DOMAIN_NAME = 'na';
                process.env.WWW_ICELANDAIR_IP_WHITELIST = 'YnVsbHNoaXRsaXN0Cg==';
                loadPlan(dockerImageMetadata).then(function (plans) {
                    loadedPlans = plans;
                    done();
                }).catch(function (error) {
                    console.debug('Failed to load plan', error);
                    done.fail(error);
                });
            });

            afterEach(function () {
                delete process.env.EXPORT1;
                delete process.env.SUB_DOMAIN_PREFIX;
                delete process.env.PREFIXED_TOP_DOMAIN_NAME;
            });

            it('should have feature deployment in origin', function () {
                expect(loadedPlan.origin).to.contain('thisIsFeatureDeploymentOne');
            });

            it('should modify deployment descriptor', function () {
                expect(loadedPlan.descriptor).to.contain('thisIsFeatureDeploymentOne');
            });

            it('should modify deployment identifier ', function () {
                expect(loadedPlan.identifier).to.be('Deployment_www-icelandair-com-thisIsFeatureDeploymentOne');
            });

        });

    describe('FEATURE_NAME - feature deployment to k8s using base64 tar ', function () {

        let dockerImageMetadata ={
            imageDefinition: {
                herdName: 'deployment-one',
                image: 'testenvimage-migrations',
                imagetag: '0.0.0'
            },
            dockerLabels:{
                "is.icelandairlabs.builddate": "Tue 26 Dec 14:52:54 GMT 2017",
                "is.icelandairlabs.dbmigration": "testenvimage-migrations:0.0.0",
                "is.icelandairlabs.git.branch": "master",
                "is.icelandairlabs.git.hash": "b14892def916aa1fffa9728a5d58f7359f982c02",
                "is.icelandairlabs.git.url": "https://github.com/Icelandair/shepherd.git",
                "is.icelandairlabs.kube.config.tar.base64": "H4sIAEZiQloAA+1XTXPiOBDlzK9QpXLaKoFtDEz5RhLPrmvCRwEzmRsl7A5Rxba8sgyhsvnvK9t8\nGBsCSSbJTq3fBSy1XkvqVuupVncgcNnSA1/UK+8DRaLdbsa/arupZn/XqKgNTW21G0qrqVcUVdM1\npYKa7zSfHUShIByhyixyXfqM3bH+3xS1bPwXiwWmNrjEdwjl2GZebdtbW3ru63zEAW619EPxbzR0\nbTf+mqqozQpSfu1S9+N/Hn8S0B/AQ8p8A8GDAD/+G9bn6hQEUav31HcMdLVJgqonmx0iiFFFyCce\nGKiYNLLLJVNww9joWTOEBAVuoFvOfOnbqYYB2PEoLj1Sm4QG0uSXAC9wiYCULzuFGFlfR/3t8Rk3\nrf3GoB6ZwUCGewQ2B5Fhxituh9n3wDGHGQ0FX+JAGuMwsV7Z2pKbUF/ubHZ0wmyg88fx4Hpy1b/8\nZg4nVrfzp/m0MTph+vHuhCziNmTIk42gHhW5NjmVIDKQUvuSa/bAY3xpoKaqdXe6OPwdQXiQRz/A\nozVbWZ6A8TwF3u7KQPYa6Iua40qXfidEgAPOHpa5btkmmM1cA40vB89T63p+nlvu8EXkc+ZGHnRZ\n5BfXk3JuwyQzMcQ2yJXnyDkQp++7cpsEjyC/gzH3gIg7A53Vk9H1XcqzvW79GfUfMLHd1zsDYdcT\nmnpMU8/6AX++f7XD772x1TUnZu+HNez3umZvnHMxJ24EXznz8hmUHItbOuuS4Bssh3BbNFjH6fzR\n/DnoD8fq0x6Te5Brk/6LJyt7piaj0fCEY4XDkL/xaLU+7mil2binJB1JwrQ47fpN23rJ8PgSxHkO\nuTkxD72VlVhAweXeBNxEeNfXwd0/kMVUlvzCNuE08os72evKyltIjSDJ601/LZ5M9bNv2P82jum/\nEPhcNr1e/FWO6j9Nfub0n6JJ81L/fQCy+m++1nujNOinij3i+0wQEQtHA6VyapU1sYis3UdT4D4I\nCGuU1ckixC4jDp4SySLrS3ob4+39e/bH2UsUZBhNHebJuz++NUbfL6Sw6nas3mQwNL9aP5/iKaRK\nkwVbu7TTvJqM+4P1gF6nuxJiAognBaJLg40gFctATuFaTvxiNe9qRuTg5K9UNEo6nvAZiB2Rk5c2\nm/VmRut6ozB8LWQK8iVLEIILtmD85XobY1z91SlQZsDvlAGfXYBKfCqO3P+YyizhPnHfIgSO3P9K\nQ2/m7n9NVdrl/f8ReHPx32TIiRV7a78urIUaqsZJkat5ZY17HxzT/+l77k3y/+j5l+/bvP5XlUZ5\n/j8Ce8//5foRf1oF2HnDZ2tARkWtSTaPcwP9gxOj88cLEkJLvwKbOWDc3NxMrEvzutO76ljDiTWY\n3Pxljc1razR+Kg9yiRIlSpQoUaJEiRIlSrwa/wJ4qk95ACgAAA==",
                "is.icelandairlabs.lastcommits": "VGh1LCAyMSBEZWMgMjAxNyAxMDo0NTo0NSArMDAwMCBieSBHdcOwbGF1Z3VyIFMuIEVnaWxzc29u\nLiAtLS0gQmV0dGVyIHVzZSByaWdodCBtYWtlIHRhcmdldCBXZWQsIDIwIERlYyAyMDE3IDE4OjE1\nOjUwICswMDAwIGJ5IEd1w7BsYXVndXIgUy4gRWdpbHNzb24uIC0tLSBBIGxpdHRsZSB0cmlja2Vy\neSB0byBtYWtlIGphc21pbmUgcnVubmFibGUgd2l0aCBzcmMgZGlyIG1hcHBlZCBpbiBkb2NrZXIt\nY29tcG9zZS4gV2VkLCAyMCBEZWMgMjAxNyAxNzoxMDozOCArMDAwMCBieSBHdcOwbGF1Z3VyIFMu\nIEVnaWxzc29uLiAtLS0gSmVua2lucyBqb2IgY2Fubm90IHVzZSAtaXQgV2VkLCAyMCBEZWMgMjAx\nNyAxNjo1OToxMyArMDAwMCBieSBHdcOwbGF1Z3VyIFMuIEVnaWxzc29uLiAtLS0gQWxsIHRlc3Rz\nIG5vdyBydW5uaW5nIGluIGRvY2tlciBpbWFnZXMuIEFkZGVkIEplbmtpbnNmaWxlLiBQbHVzIGxv\ndHMgb2Ygc21hbGxlciBpbXByb3ZlbWVudHMvY2hhbmdlcy4gV2VkLCAyMCBEZWMgMjAxNyAwOToz\nMToxMCArMDAwMCBieSBHdcOwbGF1Z3VyIEVnaWxzc29uIEBndWxsaS4gLS0tIFJlc29sdmUgdG9k\nbywgZXhpdCB3aXRoIGVycm9yIGlmIGltYWdlIHNwZWNpZmllZCBpcyBub3QgYWN0aW9uYWJsZS4K",
                "is.icelandairlabs.name": "Testimage",
                "is.icelandairlabs.version": "0.0.0"
            }
        };


        describe('using upstream and featurename env variables', function () {

            let loadedPlans;
            beforeEach(function (done) {
                process.env.UPSTREAM_IMAGE_NAME = 'deployment-one';
                process.env.FEATURE_NAME = 'some-branch/name';
                process.env.EXPORT1 = 'na';
                process.env.SUB_DOMAIN_PREFIX = 'na';
                process.env.PREFIXED_TOP_DOMAIN_NAME = 'na';
                process.env.WWW_ICELANDAIR_IP_WHITELIST = 'YnVsbHNoaXRsaXN0Cg==';
                loadPlan(dockerImageMetadata).then(function (plans) {
                    loadedPlans = plans;
                    done();
                }).catch(function (error) {
                    console.debug('Failed to load plan', error);
                    done.fail(error);
                });
            });

            afterEach(function () {
                delete process.env.UPSTREAM_IMAGE_NAME;
                delete process.env.FEATURE_NAME;
                delete process.env.EXPORT1;
                delete process.env.SUB_DOMAIN_PREFIX;
                delete process.env.PREFIXED_TOP_DOMAIN_NAME;
            });

            it('should have feature deployment in origin', function () {
                expect(loadedPlan.origin).to.contain('deployment-one::some-branch--name');
            });

            it('should modify deployment descriptor', function () {
                expect(loadedPlan.descriptor).to.contain('www-icelandair-com-some-branch--name');
            });

            it('should modify deployment identifier ', function () {
                expect(loadedPlan.identifier).to.be('Deployment_www-icelandair-com-some-branch--name');
            });

            it('should modify configmap identifier ', function () {
                console.log(loadedPlans[3].descriptor);
                expect(loadedPlan.descriptor).to.contain('www-icelandair-com-some-branch--name');
            });

            it('should modify configmap references ', function () {
                expect(loadedPlan.descriptor).to.contain('www-icelandair-com-nginx-acls-some-branch--name');
            });

        });
    });


        describe('missing env variable', function () {

            let loadError;
            beforeEach(function (done) {
                delete process.env.EXPORT1;
                loadPlan(dockerImageMetadata).then(function () {
                    expect().fail('Not expected to succeed!');
                }).catch(function (error) {
                    loadError = error;
                    done();
                });
            });


            it('should report filename in error', function () {
                expect(loadError).to.contain('./deployment/www-icelandair-com.deployment.yml');
            });

            it('should report origin in error', function () {
                expect(loadError).to.contain('testenvimage-migrations');

            });

            it('should report line in error', function () {
                expect(loadError).to.contain('line ');

            });

            it('should report variable in error', function () {
                expect(loadError).to.contain('${EXPORT1}');

            });
        });

        describe('missing env variable for base64 decoding', function () {

            let loadError;
            beforeEach(function (done) {
                process.env.EXPORT1='qwerty';
                process.env.SUB_DOMAIN_PREFIX='qwerty';
                process.env.PREFIXED_TOP_DOMAIN_NAME='qwerty';
                delete process.env.WWW_ICELANDAIR_IP_WHITELIST;
                loadPlan(dockerImageMetadata).then(function () {
                    expect().fail('Not expected to succeed!');
                }).catch(function (error) {
                    loadError = error;
                    done();
                });
            });


            it('should report filename in error', function () {
                expect(loadError).to.contain('/deployment/www-icelandair-com.config.yml');
            });

            it('should report origin in error', function () {
                expect(loadError).to.contain('testenvimage');

            });

            it('should report line in error', function () {
                expect(loadError).to.contain('line 8');

            });

            it('should report missing base64 encoded variable in error', function () {
                expect(loadError).to.contain('WWW_ICELANDAIR_IP_WHITELIST');

            });
        });
    });

    describe('with invalid base64 tar archive', function () {

        xit('should give meaningful message if base64tar archive is not legal', function () {

        });

        xit('should give meaningful message if file in archive is binary', function () {

        });

    });

});