# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = "sinatra_more"
  s.version = "0.3.43"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Nathan Esquenazi"]
  s.date = "2011-02-18"
  s.description = "Expands sinatra with standard helpers and tools to allow for complex applications"
  s.email = "nesquena@gmail.com"
  s.executables = ["sinatra_gen"]
  s.files = ["bin/sinatra_gen"]
  s.require_paths = ["lib"]
  s.rubyforge_project = "sinatra_more"
  s.rubygems_version = "2.0.14"
  s.summary = "Expands sinatra with standard helpers and tools to allow for complex applications"

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<sinatra>, [">= 0.9.2"])
      s.add_runtime_dependency(%q<tilt>, [">= 0.2"])
      s.add_runtime_dependency(%q<thor>, [">= 0.11.8"])
      s.add_runtime_dependency(%q<activesupport>, [">= 0"])
      s.add_runtime_dependency(%q<bundler>, [">= 0.9.2"])
      s.add_development_dependency(%q<haml>, [">= 2.2.14"])
      s.add_development_dependency(%q<shoulda>, [">= 2.10.2"])
      s.add_development_dependency(%q<mocha>, [">= 0.9.7"])
      s.add_development_dependency(%q<rack-test>, [">= 0.5.0"])
      s.add_development_dependency(%q<webrat>, [">= 0.5.1"])
      s.add_development_dependency(%q<jeweler>, [">= 0"])
      s.add_development_dependency(%q<builder>, [">= 0"])
      s.add_development_dependency(%q<tmail>, [">= 0"])
      s.add_development_dependency(%q<xml-simple>, [">= 0"])
      s.add_development_dependency(%q<warden>, [">= 0"])
    else
      s.add_dependency(%q<sinatra>, [">= 0.9.2"])
      s.add_dependency(%q<tilt>, [">= 0.2"])
      s.add_dependency(%q<thor>, [">= 0.11.8"])
      s.add_dependency(%q<activesupport>, [">= 0"])
      s.add_dependency(%q<bundler>, [">= 0.9.2"])
      s.add_dependency(%q<haml>, [">= 2.2.14"])
      s.add_dependency(%q<shoulda>, [">= 2.10.2"])
      s.add_dependency(%q<mocha>, [">= 0.9.7"])
      s.add_dependency(%q<rack-test>, [">= 0.5.0"])
      s.add_dependency(%q<webrat>, [">= 0.5.1"])
      s.add_dependency(%q<jeweler>, [">= 0"])
      s.add_dependency(%q<builder>, [">= 0"])
      s.add_dependency(%q<tmail>, [">= 0"])
      s.add_dependency(%q<xml-simple>, [">= 0"])
      s.add_dependency(%q<warden>, [">= 0"])
    end
  else
    s.add_dependency(%q<sinatra>, [">= 0.9.2"])
    s.add_dependency(%q<tilt>, [">= 0.2"])
    s.add_dependency(%q<thor>, [">= 0.11.8"])
    s.add_dependency(%q<activesupport>, [">= 0"])
    s.add_dependency(%q<bundler>, [">= 0.9.2"])
    s.add_dependency(%q<haml>, [">= 2.2.14"])
    s.add_dependency(%q<shoulda>, [">= 2.10.2"])
    s.add_dependency(%q<mocha>, [">= 0.9.7"])
    s.add_dependency(%q<rack-test>, [">= 0.5.0"])
    s.add_dependency(%q<webrat>, [">= 0.5.1"])
    s.add_dependency(%q<jeweler>, [">= 0"])
    s.add_dependency(%q<builder>, [">= 0"])
    s.add_dependency(%q<tmail>, [">= 0"])
    s.add_dependency(%q<xml-simple>, [">= 0"])
    s.add_dependency(%q<warden>, [">= 0"])
  end
end
